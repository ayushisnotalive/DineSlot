import {Pool} from "pg"
import { env } from "../configs/env.ts"

export const db = new Pool({
    connectionString : env.DATABASE_URL,
});

export async function connectDB(){
     try {
        await db.query("SELECT NOW();");

        console.log("✅ PostgreSQL Connected");
    } catch (err) {
        console.error("❌ Database Connection Failed");
        console.error(err);
        process.exit(1);
    }
}
