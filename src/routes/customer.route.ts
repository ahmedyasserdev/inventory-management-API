import { getCustomers , createCustomer, getCustomerById } from "@/controllers/customers.controller";
import { Router } from "express";

 const customerRouter = Router();

    customerRouter.get("/customers" , getCustomers)
    customerRouter.get("/customers/:id" , getCustomerById)
    customerRouter.post("/customers" , createCustomer)

export default customerRouter