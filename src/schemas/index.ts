import { z } from "zod";

export const createUserSchema = z.object({
    email: z.string().email().min(1, { message: "Email is Required" }),
    username: z.string().min(1, { message: "Username is Required" }),
    firstName: z.string().min(1, { message: "First Name is Required" }),
    lastName: z.string().min(1, { message: "Last Name is Required" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    phone: z.string().min(1, { message: "Phone Number is Required" }),
    image: z.string().optional(),
    dot: z.date().optional(),
    role: z.enum(["ATTENDANT", "ADMIN",], { message: "Invalid Role" }),
    gender: z.enum(["MALE", "FEMALE"], { message: "Invalid Gender" })
});

// ... existing code ...

export const createShopSchema = z.object({
    name: z.string().min(1, { message: "Shop name is required" }),
    location: z.string().min(1, { message: "Shop location is required" }),
    slug: z.string()
        .min(1, { message: "Slug is required" }),
    attendantIds: z.array(z.string(),).min(1, { message: "At least one attendant is required" }),
    adminId: z.string().min(1, { message: "Admin ID is required" })
});