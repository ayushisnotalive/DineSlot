import { readFileSync } from "fs";
import { join } from "path";
import { db } from "../db.ts";

async function migrate() {
    try {
        const sql = readFileSync(
            join(import.meta.dir, "../SQL/schema.sql"),
            "utf-8"
        );
        await db.query(sql);

        console.log("db migrated successfully");
        await db.end();
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        await db.end();
        process.exit(1);
    }
}

migrate();