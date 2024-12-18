import { createProduct, deleteProductById, getProductById, getProducts, updateProductById } from "@/controllers/products.controller";
import { Router } from "express";

const productRouter = Router()


productRouter.post("/products", createProduct)
productRouter.get("/products", getProducts)
productRouter.get("/products/:id", getProductById)
productRouter.patch("/products/:id", updateProductById)
productRouter.delete("/products/:id", deleteProductById)


export default productRouter