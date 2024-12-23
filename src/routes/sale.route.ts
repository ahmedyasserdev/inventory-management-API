import { createSale, createSaleItem, getSales } from "@/controllers/sales.controller";
import { Router } from "express";

const salesRouter = Router()


salesRouter.post("/sales", createSale )
salesRouter.post("/sales/items", createSaleItem )
salesRouter.get("/sales", getSales )
// saleRouter.get("/sale/:id", getBrandById )
// saleRouter.patch("/sale/:id",  updateBrandById    )
// saleRouter.delete("/sale/:id" , deleteBrandById)


export default salesRouter