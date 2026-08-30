import argon2 from "argon2"

export async function hashedPassword(password:string): Promise<string>{
    return await argon2.hash(password,
        {
        type: argon2.argon2id
    }
    )
}

export async function verifyPassword(
    password  : string,
    hash : string
): Promise<boolean>{
    return argon2.verify(password,hash)
}