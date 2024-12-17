import { authorizeUser } from "@/controllers/login.controller";
import { Router } from "express";

const loginRouter = Router();

loginRouter.post("/auth/login" , authorizeUser)


export default loginRouter