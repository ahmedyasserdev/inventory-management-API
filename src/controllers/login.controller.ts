import { db } from "@/db";
import { generateAccessToken,  } from "@/utils";
import { compare,  } from "bcrypt";
import { Request, Response } from "express";


export const authorizeUser = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    if (!password || (!email && !username)) {
        return res.status(400).json({ error: "Email or username and password are required", data: null });
    }

    try {
        const user = await db.user.findUnique({
            where: email ? { email } : { username }
        });

        if (!user) {
            return res.status(404).json({ error: "Wrong Credentials", data: null });
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Wrong Password", data: null });
        }

        const { password: _, ...userWithoutPassword } = user;
        const accessToken = generateAccessToken(userWithoutPassword);

        return res.status(200).json({ data: { ...userWithoutPassword, accessToken }, error: null });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error", data: null });
    }
};
