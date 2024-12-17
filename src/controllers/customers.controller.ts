import { db } from "@/db";
import { createCustomerSchema } from "@/schemas";
import { handleValidationResponse } from "@/utils";
import { validateSchema } from "@/utils";
import { Request, Response } from "express"


export const createCustomer = async (req: Request, res: Response) => {
    const {
        email,
        phone,
        firstName,
        lastName,
        gender,
        NIN,
        country,
        location,
        dot,
        maxCreditLimit,
        maxCreditDays,
        taxPin,
        customerType,

    } = req.body;
    try {

        const validatedFields = validateSchema(createCustomerSchema, req.body);

        if (!handleValidationResponse(validatedFields, res)) return;

        const existingCustomerByEmail = await db.customer.findUnique({
            where: {
                email
            }
        })

        if (existingCustomerByEmail) return res.status(409).json({ error: `this customer email (${email}) already exists!`, data: null });


        const existingCustomerByPhoneNumber = await db.customer.findUnique({
            where: {
                phone
            }
        })

        if (existingCustomerByPhoneNumber) return res.status(409).json({ error: `this customer phone number (${phone}) already exists!`, data: null });





        const existingCustomerByNationalId = await db.customer.findUnique({
            where: {
                NIN
            }
        })

        if (existingCustomerByNationalId) return res.status(409).json({ error: `this customer National Id (${NIN}) already exists!`, data: null });


        const newCustomer = await db.customer.create({
            data: {
                email,
                phone,
                firstName,
                lastName,
                gender,
                NIN,
                country,
                location,
                dot,
                maxCreditLimit,
                maxCreditDays,
                taxPin,
                customerType,
            }
        })


        return res.status(201).json({ data: newCustomer, error: null })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}


export const getCustomers = async (req: Request, res: Response) => {
    try {
        const customers = await db.customer.findMany({});
        if (!customers.length) return res.status(404).json({ data: null, error: "No customers found" }) 
        return res.status(200).json({ data: customers, error: null })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}



export const getCustomerById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        if (!id) return res.status(500).json({ data: null, error: "Missing Customer Id" })
        const customer = await db.customer.findUnique({
            where: {
                id,
            }
        });
        
        if (!customer) return res.status(404).json({ data: null, error: "Customer not found" })

        return res.status(200).json({ data: customer, error: null })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}