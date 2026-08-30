import {readFileSync} from "fs"
import { join } from "path"
import { db } from "../db.ts"

async function migrate(){
    try{
            const sql = readFileSync(
                join(import.meta.dir, "../SQL/schema.sql"),
                "utf-8"
            )
            await db.query(sql)
            
            console.log("db migrated successfully")
    }
    catch (err) {

        console.error(err);
    }
    finally{
        db.end()
    }
}

migrate()