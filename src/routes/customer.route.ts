import { getCustomers , createCustomer } from "@/controllers/customers.controller";
import { Router } from "express";

 const customerRouter = Router();

    customerRouter.get("/customers" , getCustomers)
    customerRouter.post("/customers" , createCustomer)

export default customerRouter