import { createCategory, deleteCategoryById, getCategories, getCategoryById, updateCategoryById } from "@/controllers/categories.controller";
import { Router } from "express";

const categoryRouter = Router()


categoryRouter.post("/category", createCategory)
categoryRouter.get("/category", getCategories)
categoryRouter.get("/category/:id", getCategoryById)
categoryRouter.patch("/category/:id", updateCategoryById )
categoryRouter.delete("/category/:id" , deleteCategoryById)


export default categoryRouter