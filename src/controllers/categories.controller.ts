import { db } from "@/db";
import { createCategorySchema } from "@/schemas";
import { handleValidationResponse, validateSchema } from "@/utils";
import { Request, Response } from "express";

export const createCategory = async (req: Request, res: Response) => {
    const { name, slug,  } = req.body;
    try {

        const validatedFields = validateSchema(createCategorySchema, req.body);

        if (!handleValidationResponse(validatedFields, res)) return;



        const existingCategory= await db.category.findUnique({
            where: {
                slug
            }
        });

        if (existingCategory) return res.status(409).json({ error: `category (${name}) already exists`, data: null })

        const newCategory= await db.category.create({
            data: {
                name,
                slug,
            },
        })


        return res.status(201).json({ data: newCategory, error: null })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}


export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await db.category.findMany({ orderBy: { name: "desc" } });
        return res.status(200).json({ data: categories, error: null })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}


export const getCategoryById = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        if (!id) return res.status(500).json({ data: null, error: "Missing Category Id" })

        const category = await db.category.findUnique({
            where: {
                id
            }
        });
        if (!category) return res.status(404).json({ data: null, error: "category not found" })



        return res.status(200).json({ data: category, error: null })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}


export const updateCategoryById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const {
        name,
        slug,
    } = req.body;

    try {

        if (!id) return res.status(500).json({ data: null, error: "Missing category Id" }) 
        const existingCategory = await db.category.findUnique({ where: { id } })

        if (!existingCategory) return res.status(404).json({ data: null, error: "category not found" })

        if (slug !== existingCategory.slug) {
            const existingSlugBySlug = await db.category.findUnique({
                where: { slug }
            });
            if (existingSlugBySlug) {
                return res.status(409).json({ error: `this category name (${name}) already exists!`, data: null });
            }
        }


        const updatedCategory = await db.category.update({
            where: {
                id
            },
            data: {
                name,
                slug,
            }
        });

        return res.status(200).json({ data: updatedCategory, error: null })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}





export const deleteCategoryById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        if (!id) return res.status(500).json({ data: null, error: "Missing category Id" });
        const category = await db.category.findUnique({ where: { id } })

        if (!category) return res.status(404).json({ data: null, error: "category not found" })

        await db.category.delete({ where: { id } })


        return res.status(200).json({ success: true, error: null })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }


}