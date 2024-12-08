import { db } from "@/db";
import { Request, Response } from "express";
import { hash } from "bcrypt"
import { Role, User } from "@prisma/client";


export const createUser = async (req: Request, res: Response) => {
    const {
        email,
        username,
        firstName,
        lastName,
        password,
        phone,
        image,
        dot,
        role,
        gender

    } = req.body;

    try {
        const existingUserByEmail = await db.user.findUnique({
            where: { email }
        });

        if (existingUserByEmail) { res.status(409).json({ error: `this email (${email}) already exists!`, data: null }); return; }

        const existingUserByPhone = await db.user.findUnique({
            where: { phone }
        });

        if (existingUserByPhone) { res.status(409).json({ error: `this phone number (${phone}) is already taken!`, data: null }); return; }

        const existingUserByUsername = await db.user.findUnique({
            where: { username }
        });

        if (existingUserByUsername) { res.status(409).json({ error: `this username (${username}) is already taken!`, data: null }); return; }

        const hashedPassword: string = await hash(password, 10)

        const newUser: User = await db.user.create({
            data: {
                email,
                username,
                firstName,
                lastName,
                password: hashedPassword,
                phone,
                image: image ? image : "https://utfs.io/f/c61ec63c-42b1-4939-a7fb-ed04d43e23ee-2558r.png",
                dot,
                role : role ?? Role.ATTENDANT ,
                gender
            }
        })




       return  res.status(201).json({ data: { ...newUser, password: undefined }, error: null })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}


export const getUsers = async (req: Request, res: Response) => {
    try {
        const users: User[] = await db.user.findMany({
            orderBy: { createdAt: "desc" }
        });


        const usersWithoutPasswords = users.map((user: User) => ({
            ...user,
            password: undefined
        }))
       return res.status(200).json({ data: usersWithoutPasswords })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}

export const getAttendants = async (req: Request, res: Response) => {
    try {
        const users: User[] = await db.user.findMany({
            orderBy: { createdAt: "desc" },
            where : {
                role : Role.ATTENDANT
            }
        });


        const usersWithoutPasswords = users.map((user: User) => ({
            ...user,
            password: undefined
        }))
      return  res.status(200).json({ data: usersWithoutPasswords })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}


export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {

        if (!id) return res.status(500).json({ data: null, error: "Missing User Id" })
        const user = await db.user.findUnique({
            where: {
                id
            }
        });

        if (!user) return res.status(404).json({ data: null, error: "User not found" })
    return    res.status(200).json({ data: { ...user, password: undefined }, error: null })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}


export const updateUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const {
        email,
        username,
        firstName,
        lastName,
        phone,
        image,
        dot,
        role,
        gender

    } = req.body;

    try {

        if (!id) return res.status(500).json({ data: null, error: "Missing User Id" })
        const user = await db.user.findUnique({ where: { id } })

        if (!user) return res.status(404).json({ data: null, error: "User not found" })

        const updatedUser = await db.user.update({
            where: {
                id
            },
            data: {
                email,
                username,
                firstName,
                lastName,
                phone,
                image,
                dot,
                role,
                gender
            }
        });

     return   res.status(200).json({ data: { ...updatedUser, password: undefined }, error: null })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}

export const updateUserPasswordById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { password } = req.body;

    try {
        if (!id) return res.status(500).json({ data: null, error: "Missing User Id" });
        const user = await db.user.findUnique({ where: { id } })

        if (!user) return res.status(404).json({ data: null, error: "User not found" })
        const hashedPassword: string = await hash(password, 10)

        const updatedUser = await db.user.update({
            where: {
                id
            },
            data: {
                password: hashedPassword
            }
        });

        res.status(200).json({ data: { ...updatedUser, password: undefined }, error: null })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}


export const deleteUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        if (!id) return res.status(500).json({ data: null, error: "Missing User Id" });
        const user = await db.user.findUnique({ where: { id } })

        if (!user) return res.status(404).json({ data: null, error: "User not found" })

         await db.user.delete({ where: { id } })


     return   res.status(200).json({ success: true, error: null })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }


}