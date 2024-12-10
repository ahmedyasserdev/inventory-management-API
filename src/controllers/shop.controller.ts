import { db } from "@/db";
import { createShopSchema } from "@/schemas";
import { handleValidationResponse, validateSchema } from "@/utils";
import { Request, Response } from "express";

export const createShop= async (req : Request , res : Response) => {
    const {name , location , slug  , adminId,attendantIds} = req.body;
    try {

        const validatedFields = validateSchema(createShopSchema, req.body);
         
        if (!handleValidationResponse(validatedFields, res)) return;



        const existingShop = await db.shop.findUnique({
            where : {
                slug
            }
        });

            if (existingShop) return res.status(409).json({error : `Shop (${name}) already exists` , data: null})

        const newShop = await db.shop.create({
            data : {
               name ,
               slug , 
               adminId ,
               location,
               attendantIds
            },
        }) 


        return res.status(201).json({ data : newShop, error: null })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}


export const getShops = async (req : Request , res : Response) => {
    try {
        const shops = await db.shop.findMany({orderBy : {name : "desc"}});
        return res.status(200).json({ data : shops, error: null })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}


export const getShopAttendants =  async (req : Request , res : Response) => {
    const {id} = req.params
    try {
        if (!id) return res.status(500).json({ data: null, error: "Missing Shop Id" })
            
        const shop = await db.shop.findUnique({
            where : {
           id
            }
        });
        if (!shop) return res.status(404).json({ data: null, error: "Shop not found" })

            const shopAttendants = await db.user.findMany({
                where : {
                    id : {
                        in : shop.attendantIds
                    },
                },
                select : {
                    id : true ,
                    firstName : true ,
                    lastName : true, 
                    phone : true ,
                    email : true,
                    image : true
                }
            })

        return res.status(200).json({ data : shopAttendants, error: null })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}


export const getShopById = async (req : Request , res : Response) => {
    const {id} = req.params
    try {
        if (!id) return res.status(500).json({ data: null, error: "Missing Shop Id" })
            
        const shop = await db.shop.findUnique({
            where : {
           id
            }
        });
        if (!shop) return res.status(404).json({ data: null, error: "Shop not found" })

         

        return res.status(200).json({ data : shop, error: null })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}