import { db } from "@/db";
import { createUnitSchema } from "@/schemas";
import { handleValidationResponse, validateSchema } from "@/utils";
import { Request, Response } from "express";

export const createUnit = async (req: Request, res: Response) => {
    const { name, slug, abbreviation } = req.body;
    try {

        const validatedFields = validateSchema(createUnitSchema, req.body);

        if (!handleValidationResponse(validatedFields, res)) return;



        const existingUnit = await db.unit.findUnique({
            where: {
                slug
            }
        });

        if (existingUnit) return res.status(409).json({ error: `unit (${name}) already exists`, data: null })

        const newUnit = await db.unit.create({
            data: {
                name,
                slug,
                abbreviation
            },
        })


        return res.status(201).json({ data: newUnit, error: null })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}


export const getUnits = async (req: Request, res: Response) => {
    try {
        const units = await db.unit.findMany({ orderBy: { name: "desc" } });
        return res.status(200).json({ data: units, error: null })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}


export const getUnitById = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        if (!id) return res.status(500).json({ data: null, error: "Missing Unit Id" })

        const unit = await db.unit.findUnique({
            where: {
                id
            }
        });
        if (!unit) return res.status(404).json({ data: null, error: "unit not found" })



        return res.status(200).json({ data: unit, error: null })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}


export const updateUnitById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const {
        name,
        slug,
        abbreviation

    } = req.body;

    try {

        if (!id) return res.status(500).json({ data: null, error: "Missing Unit Id" })
        const existingUnit = await db.unit.findUnique({ where: { id } })

        if (!existingUnit) return res.status(404).json({ data: null, error: "Unit not found" })

        if (slug !== existingUnit.slug) {
            const existingSlugBySlug = await db.unit.findUnique({
                where: { slug }
            });
            if (existingSlugBySlug) {
                return res.status(409).json({ error: `this unit name (${name}) already exists!`, data: null });
            }
        }


        const updatedUnit = await db.unit.update({
            where: {
                id
            },
            data: {
                name,
                slug,
                abbreviation
            }
        });

        return res.status(200).json({ data: updatedUnit, error: null })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }
}





export const deleteUnitById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        if (!id) return res.status(500).json({ data: null, error: "Missing unit Id" });
        const unit = await db.unit.findUnique({ where: { id } })

        if (!unit) return res.status(404).json({ data: null, error: "unit not found" })

        await db.unit.delete({ where: { id } })


        return res.status(200).json({ success: true, error: null })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error", data: null })
    }


}