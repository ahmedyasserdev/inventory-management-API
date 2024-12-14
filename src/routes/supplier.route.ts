import { createSupplier, getSuppliers, getSupplilerById } from "@/controllers/suppliers.controller";
import { Router } from "express";

const supplierRouter = Router();

supplierRouter.post("/suppliers",  createSupplier)
supplierRouter.get("/suppliers",  getSuppliers)
supplierRouter.get("/suppliers/:id", getSupplilerById)

export default supplierRouter