import { unknown } from "zod";
import { redis } from "../../infrastructure/DB/Redis";
import type { Request,Response,NextFunction } from "express";


export const rateLimiter = (options:{windowSeconds:number; maxRequests:number})=>{
    return async(req:Request, res:Response, next:NextFunction)=>{
        try{

            const identifier = req.ip || "unknown";
            const key = `ratelimit:${req.path}:${identifier}`

            const current = await redis.incr(key);

            if(current === 1){
                // first request in this window is set to expiry---------------Xo...
                await redis.expire(key , options.windowSeconds)
            }

            if(current>options.maxRequests){
                 return res.status(429).json({
                 success: false,
                 message: "Too many requests. Please try again later.",
                });
            }


            next()
          } 
          
          
          catch (err) {
                console.error("Rate limiter error:", err);
                next(); // fail open...... dont block real traffic if Redis itself has an issue
                }
  };
};