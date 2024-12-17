import { createProduct, deleteProductById, getProductById, getProducts, updateProductById } from "@/controllers/products.controller";
import { Router } from "express";

const productRouter = Router()


productRouter.post("/product", createProduct)
productRouter.get("/product", getProducts)
productRouter.get("/product/:id", getProductById)
productRouter.patch("/product/:id", updateProductById)
productRouter.delete("/product/:id", deleteProductById)


export default productRouter