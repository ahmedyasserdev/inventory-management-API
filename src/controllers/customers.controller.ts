import { db } from "@/db";
import { Request, Response } from "express"

export const getCustomers= async (req:Request , res:Response) => {
    const costumers = [
        {
            name : "Ahmed",
            age : 18 
        },
        {
            name : "Ahmed",
            age : 18 
        },
        {
            name : "Ahmed",
            age : 18 
        },
        {
            name : "Ahmed",
            age : 18 
        },
    ]; 

    return res.status(200).json(costumers)
}

export const createCustomer = async (req : Request , res : Response) =>{
    const {name , email , phone} = req.body;

    try {
            const newCustomer = await db.customer.create({
                data : {
                    name , 
                    email , 
                    phone,
                        
                }
            });

        return res.status(201).json(newCustomer)
    } catch (error) {
        console.log(error)
    }
}

export const getCustomerById = async (req : Request , res : Response) => {
    const {id} = req.params;

    try {
            const customer = await db.customer.findUnique({
                where : {
                    id ,
                }
            });

            return  res.status(200).json(customer)
 
    } catch (error) {
        console.log(error)
        
    }
}