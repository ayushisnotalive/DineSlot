import type { Request, Response } from "express";
import { db } from "../../infrastructure/DB/db";
import { z } from "zod";

const querySchema = z.object({
  restaurant_id: z.string().uuid(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

export const getPublicResources = async (req: Request, res: Response) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "A valid restaurant_id is required",
      errors: parsed.error.flatten(),
    });
  }

  const { restaurant_id, limit = 20, offset = 0 } = parsed.data;

  try {
    const result = await db.query(
      `SELECT id, name, type_of_table, booking_class
       FROM booking.resources
       WHERE restaurant_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [restaurant_id, limit, offset]
    );

    return res.status(200).json({
      success: true,
      resources: result.rows,
      pagination: { limit, offset, count: result.rows.length },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};