import { createCategory, deleteCategoryById, getCategories, getCategoryById, updateCategoryById } from "@/controllers/categories.controller";
import { Router } from "express";

const categoryRouter = Router()


categoryRouter.post("/categories", createCategory)
categoryRouter.get("/categories", getCategories)
categoryRouter.get("/categories/:id", getCategoryById)
categoryRouter.patch("/categories/:id", updateCategoryById )
categoryRouter.delete("/categories/:id" , deleteCategoryById)


export default categoryRouter