import { db } from "@/db";
import { generateOrderNumber, handleValidationResponse, validateSchema } from "@/utils";
import { Request, Response } from "express";
import { createSaleSchema } from "@/schemas";


export const createSale = async (req: Request, res: Response) => {
    try {
        const {
            customerName,
            customerEmail,
            saleAmount,
            balanceAmount,
            paidAmount,
            paymentMethod,
            transactionCode,
            saleType,
            customerId,
            saleItems,
        } = req.body;


        const validatedFields = validateSchema(createSaleSchema, req.body);
        if (!handleValidationResponse(validatedFields, res)) return;





        const saleId = await db.$transaction(async (transaction) => {
            const sale = await transaction.sale.create({
                data: {
                    customerName,
                    saleNumber: generateOrderNumber(),
                    saleAmount,
                    customerEmail,
                    balanceAmount,
                    paidAmount,
                    paymentMethod,
                    transactionCode,
                    saleType,
                    customerId,
                },
            });


            if (saleItems && saleItems.length > 0) {
                for (const item of saleItems) {
                    // Update Product stock quantity
                    const updatedProduct = await transaction.product.update({
                        where: { id: item.productId },
                        data: {
                            aletQty: {
                                decrement: item.qty,
                            },
                        },
                    });
    
                    if (!updatedProduct) {
                        throw new Error(`Failed to update product for product ID: ${item.productId}`);
                    }
    
                    const saleItem = await transaction.saleItem.create({
                        data: {
                            productId: item.productId,
                            productName: item.name,
                            productPrice: item.price,
                            qty: item.qty,
                            productImage: item.productImage,
                            saleId: sale.id,
    
                        },
    
                    });
    
                    if (!saleItem) {
                        throw new Error(`Failed to create sale item for sale ID: ${sale.id}`);
                    }
                }
            }
            
            return sale.id;
        });


            const sale = await db.sale.findUnique({
                where: {
                    id: saleId,
    
                }
            })

       
        return res.status(201).json({ data: sale, error: null });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error", data: null });
    }
}




export const createSaleItem = async (req: Request, res: Response) => {
    try {
        // Ensure saleItems is an array from the request body
        const saleItems = Array.isArray(req.body) ? req.body : [];
        
        if (saleItems.length === 0) {
            return res.status(400).json({ 
                error: "No sale items provided", 
                data: null 
            });
        }

        const createdItems = await db.$transaction(async (transaction) => {
            const items = [];
            
            for (const item of saleItems) {
                // Update Product stock quantity
                const updatedProduct = await transaction.product.update({
                    where: { id: item.productId },
                    data: {
                        aletQty: {
                            decrement: item.qty,
                        },
                    },
                });

                if (!updatedProduct) {
                    throw new Error(`Failed to update product for product ID: ${item.productId}`);
                }

                // Create sale item
                const saleItem = await transaction.saleItem.create({
                    data: {
                        productId: item.productId,
                        productName: item.productName,
                        productPrice: item.productPrice,
                        qty: item.qty,
                        productImage: item.productImage,
                        saleId: item.saleId,
                    },
                });

                items.push(saleItem);
            }
            
            return items;
        });

        return res.status(201).json({ 
            data: createdItems, 
            error: null 
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error", data: null });
    }
}

export const getSales = async (req: Request, res: Response) => {
    try {
        const sales = await db.sale.findMany({
            include: {
                saleItems: true
            },
            orderBy: { createdAt: "desc" }
        });
        return res.status(200).json({ data: sales, error: null });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error", data: null });
    }
}
export const getSaleById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        if (!id) return res.status(500).json({ data: null, error: "Missing Sale ID" });
        const sale = await db.sale.findUnique({
            where: { id },
            include: {
                saleItems: true
            }
        });

        if (!sale) return res.status(404).json({ data: null, error: "Sale not found" });
        return res.status(200).json({ data: sale, error: null });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error", data: null });
    }
}
export const updateSaleById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
        customerName,
        customerEmail,
        balanceAmount,
        paidAmount,
        paymentMethod,
        transactionCode
    } = req.body;
    try {
        if (!id) return res.status(500).json({ data: null, error: "Missing Sale ID" });

        const existingSale = await db.sale.findUnique({
            where: { id },
            include: { saleItems: true }
        });
        if (!existingSale) return res.status(404).json({ data: null, error: "Sale not found" });
        const updatedSale = await db.sale.update({
            where: { id },
            data: {
                customerName,
                customerEmail,
                balanceAmount,
                paidAmount,
                paymentMethod,
                transactionCode
            },
            include: { saleItems: true }
        });
        return res.status(200).json({ data: updatedSale, error: null });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error", data: null });
    }
}
export const deleteSaleById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        if (!id) return res.status(500).json({ data: null, error: "Missing Sale ID" });

        const sale = await db.sale.findUnique({
            where: { id },
            include: { saleItems: true }
        });
        if (!sale) return res.status(404).json({ data: null, error: "Sale not found" });
        // First delete all related saleItems
        await db.saleItem.deleteMany({
            where: { saleId: id }
        });
        // Then delete the sale
        await db.sale.delete({ where: { id } });
        return res.status(200).json({ success: true, error: null });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error", data: null });
    }
}