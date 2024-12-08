import { createShop, getShopAttendants, getShopById, getShops } from "@/controllers/shop.controller";
import { Router } from "express";

const shopRouter = Router();


shopRouter.post("/shops" , createShop)
shopRouter.get("/shops" , getShops)
shopRouter.get("/shops/:id" , getShopById)
shopRouter.get("/shop-attendants/:id" , getShopAttendants)

export default shopRouter


