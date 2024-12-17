import { createBrand, deleteBrandById, getBrandById, getBrands, updateBrandById } from "@/controllers/brands.controller";
import { Router } from "express";

const brandRouter = Router()


brandRouter.post("/brands", createBrand )
brandRouter.get("/brands", getBrands )
brandRouter.get("/brands/:id", getBrandById )
brandRouter.patch("/brands/:id",  updateBrandById    )
brandRouter.delete("/brands/:id" , deleteBrandById)


export default brandRouter