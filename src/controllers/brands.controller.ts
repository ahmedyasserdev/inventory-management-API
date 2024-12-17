import { db } from "@/db";
import { createBrandSchema } from "@/schemas";
import { handleValidationResponse, validateSchema } from "@/utils";
import { Request, Response } from "express";

export const createBrand = async (req: Request, res: Response) => {
    const { name, slug,  } = req.body;
    try {

        const validatedFields = validateSchema(createBrandSchema, req.body);

        if (!handleValidationResponse(validatedFields, res)) return;



        const existingBrand= await db.brand.findUnique({
            where: {
                slug
            }
        });

        if (existingBrand) return res.status(409).json({ error: `Brand (${name}) already exists`, data: null })

        const newBrand= await db.brand.create({
            data: {
                name,
                slug,
            },
        })


        return res.status(201).json({ data: newBrand, error: null })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}


export const getBrands = async (req: Request, res: Response) => {
    try {
        const brands = await db.brand.findMany({ orderBy: { name: "desc" } });
        return res.status(200).json({ data: brands, error: null })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}


export const getBrandById = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        if (!id) return res.status(500).json({ data: null, error: "Missing BrandId" })

        const brand = await db.brand.findUnique({
            where: {
                id
            }
        });
        if (!brand) return res.status(404).json({ data: null, error: "brand not found" })



        return res.status(200).json({ data: brand, error: null })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}


export const updateBrandById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const {
        name,
        slug,
    } = req.body;

    try {

        if (!id) return res.status(500).json({ data: null, error: "Missing brand Id" }) 
        const existingBrand = await db.brand.findUnique({ where: { id } })

        if (!existingBrand) return res.status(404).json({ data: null, error: "brand not found" })

        if (slug !== existingBrand.slug) {
            const existingSlugBySlug = await db.brand.findUnique({
                where: { slug }
            });
            if (existingSlugBySlug) {
                return res.status(409).json({ error: `this brand name (${name}) already exists!`, data: null });
            }
        }


        const updatedbrand = await db.brand.update({
            where: {
                id
            },
            data: {
                name,
                slug,
            }
        });

        return res.status(200).json({ data: updatedbrand, error: null })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}





export const deleteBrandById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        if (!id) return res.status(500).json({ data: null, error: "Missing brand Id" });
        const brand = await db.brand.findUnique({ where: { id } })

        if (!brand) return res.status(404).json({ data: null, error: "brand not found" })

        await db.brand.delete({ where: { id } })


        return res.status(200).json({ success: true, error: null })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }


}