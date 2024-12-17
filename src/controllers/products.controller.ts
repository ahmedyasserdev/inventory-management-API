import { db } from "@/db";
import { createProductSchema } from "@/schemas";
import { handleValidationResponse, validateSchema } from "@/utils";
import { Request, Response } from "express";

export const createProduct = async (req: Request, res: Response) => {
    const { 
        name, 
        description,
        batchNumber,
        barCode,
        image,
        tax,
        aletQty,
        sku,
        productCode,
        expiryDate,
        slug,
        price,
        buyingPrice,
        unitId,
        brandId,
        categoryId,
        supplierId
    } = req.body;
    
    try {
        const validatedFields = validateSchema(createProductSchema, req.body);
        if (!handleValidationResponse(validatedFields, res)) return;

        const existingProduct = await db.product.findFirst({
            where: {
                OR: [
                    { barCode },
                    { sku },
                    { productCode },
                    { slug }
                ]
            }
        });

        if (existingProduct) {
            return res.status(409).json({ 
                error: "Product already exists with this barcode, SKU, product code, or slug", 
                data: null 
            });
        }

        const newProduct = await db.product.create({
            data: {
                name,
                description,
                batchNumber,
                barCode,
                image,
                tax,
                aletQty,
                sku,
                productCode,
                expiryDate: new Date(expiryDate),
                slug,
                price,
                buyingPrice,
                unitId,
                brandId,
                categoryId,
                supplierId
            },
        });

        return res.status(201).json({ data: newProduct, error: null });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error", data: null });
    }
};

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await db.product.findMany({
            include: {
                Unit: true,
                Brand: true,
                Category: true,
                Supplier: true
            },
            orderBy: { createdAt: "desc" }
        });
        
        return res.status(200).json({ data: products, error: null });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error", data: null });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        if (!id) return res.status(400).json({ data: null, error: "Missing Product Id" });

        const product = await db.product.findUnique({
            where: { id },
            include: {
                Unit: true,
                Brand: true,
                Category: true,
                Supplier: true
            }
        });

        if (!product) return res.status(404).json({ data: null, error: "Product not found" });

        return res.status(200).json({ data: product, error: null });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error", data: null });
    }
};

export const updateProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
        name,
        description,
        batchNumber,
        barCode,
        image,
        tax,
        aletQty,
        sku,
        productCode,
        expiryDate,
        slug,
        price,
        buyingPrice,
        unitId,
        brandId,
        categoryId,
        supplierId
    } = req.body;

    try {
        if (!id) return res.status(400).json({ data: null, error: "Missing Product Id" });
        
        const existingProduct = await db.product.findUnique({ where: { id } });
        if (!existingProduct) return res.status(404).json({ data: null, error: "Product not found" });

        if (barCode !== existingProduct.barCode || 
            sku !== existingProduct.sku || 
            productCode !== existingProduct.productCode || 
            slug !== existingProduct.slug) {
            
            const duplicateCheck = await db.product.findFirst({
                where: {
                    AND: [
                        { id: { not: id } },
                        {
                            OR: [
                                { barCode },
                                { sku },
                                { productCode },
                                { slug }
                            ]
                        }
                    ]
                }
            });

            if (duplicateCheck) {
                return res.status(409).json({ 
                    error: "Another product already exists with this barcode, SKU, product code, or slug", 
                    data: null 
                });
            }
        }

        const updatedProduct = await db.product.update({
            where: { id },
            data: {
                name,
                description,
                batchNumber,
                barCode,
                image,
                tax,
                aletQty,
                sku,
                productCode,
                expiryDate: new Date(expiryDate),
                slug,
                price,
                buyingPrice,
                unitId,
                brandId,
                categoryId,
                supplierId
            },
            include: {
                Unit: true,
                Brand: true,
                Category: true,
                Supplier: true
            }
        });

        return res.status(200).json({ data: updatedProduct, error: null });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error", data: null });
    }
};

export const deleteProductById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        if (!id) return res.status(400).json({ data: null, error: "Missing Product Id" });
        
        const product = await db.product.findUnique({ where: { id } });
        if (!product) return res.status(404).json({ data: null, error: "Product not found" });

        await db.product.delete({ where: { id } });

        return res.status(200).json({ success: true, error: null });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error", data: null });
    }
};