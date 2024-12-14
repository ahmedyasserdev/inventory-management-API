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


export const createShopSchema = z.object({
    name: z.string().min(1, { message: "Shop name is required" }),
    location: z.string().min(1, { message: "Shop location is required" }),
    slug: z.string()
        .min(1, { message: "Slug is required" }),
    attendantIds: z.array(z.string(),).min(1, { message: "At least one attendant is required" }),
    adminId: z.string().min(1, { message: "Admin ID is required" })
});

export const createCustomerSchema = z.object({
    email: z.string().email().optional(),
    phone: z.string().min(1, "Phone number is required"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    gender: z.enum(["MALE", "FEMALE"]),
    NIN: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    location: z.string().min(1, "Location is required"),
    dot: z.string().datetime().optional(),
    maxCreditLimit: z.number().min(1, { message: "Credit limit is required" }).positive("Credit limit must be positive"),
    maxCreditDays: z.number().min(1, { message: 'Credit days is required' }).int().positive("Credit days must be positive"),
    taxPin: z.string().optional(),
    customerType: z.enum(["RETAIL", "WHOLESALE", "DISTRIBUTOR", "OTHER"])
});


export const createSupplierSChema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email().optional(),
    contactPerson: z.string().min(1, { message: "Contact person is required" }),
    phone: z.string().min(1, { message: "Phone number is required" }),
    location: z.string().min(1, { message: "Location is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    website: z.string().optional(),
    taxPin: z.string().optional(),
    regnNumber: z.string().optional(),
    bankAccountNumber: z.string().optional(),
    paymentTerm: z.string().optional(),
    logo: z.string().optional(),
    rating: z.number().optional(),
    notes: z.string().optional(),
    supplierType: z.enum(["MANUFACTURER", "RETAIL", "WHOLESALE", "DISTRIBUTOR", "OTHER"], {
        message: "Invalid supplier type"
    })
});