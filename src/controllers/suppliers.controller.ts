import { db } from "@/db";
import { createSupplierSChema } from "@/schemas";
import { handleValidationResponse } from "@/utils";
import { validateSchema } from "@/utils";
import { Request, Response } from "express"


export const createSupplier = async (req: Request, res: Response) => {
    const {
        name,
        email,
        contactPerson,
        phone,
        location,
        country,
        website,
        taxPin,
        regnNumber,
        bankAccountNumber,
        paymentTerm,
        logo,
        rating,
        notes,
        supplierType,

    } = req.body;
    try {

        const validatedFields = validateSchema(createSupplierSChema, req.body);

        if (!handleValidationResponse(validatedFields, res)) return;

        const existingSupplierByEmail = await db.supplier.findUnique({
            where: {
                email
            }
        })

        if (existingSupplierByEmail) return res.status(409).json({ error: `this supplier email (${email}) already exists!`, data: null });


        const existingSupplierByPhoneNumber = await db.supplier.findUnique({
            where: {
                phone
            }
        })

        if (existingSupplierByPhoneNumber) return res.status(409).json({ error: `this supplier phone number (${phone}) already exists!`, data: null });

        const existingSupplierByRegNumber = await db.supplier.findUnique({
            where: {
                regnNumber
            }
        })

        if (existingSupplierByRegNumber) return res.status(409).json({ error: `this supplier Resgistration number (${regnNumber}) already exists!`, data: null });

        const newSupplier = await db.supplier.create({
            data: {
                name,
                email,
                contactPerson,
                phone,
                location,
                country,
                website,
                taxPin,
                regnNumber,
                bankAccountNumber,
                paymentTerm,
                logo,
                rating,
                notes,
                supplierType,
            }
        })


        return res.status(201).json({ data: newSupplier, error: null })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}


export const getSuppliers = async (req: Request, res: Response) => {

    try {
        const suppliers = await db.supplier.findMany({ orderBy: { createdAt: "desc" } })

        if (!suppliers.length) return res.status(404).json({ data: null, error: "No suppliers found" })
        return res.status(200).json(suppliers)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}



export const getSupplilerById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {

        if (!id) return res.status(500).json({ data: null, error: "Missing Supplier Id" })
        const supplier = await db.supplier.findUnique({
            where: {
                id,
            }
        });

        if (!supplier) return res.status(404).json({ data: null, error: "Supplier not found" })

        return res.status(200).json({ data: supplier, error: null })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })

    }
}