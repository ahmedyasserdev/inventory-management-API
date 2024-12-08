import { createUser, getUsers , getUserById, updateUserPasswordById, updateUserById, deleteUserById, getAttendants } from "@/controllers/users.controller";
import { Router } from "express";

const userRouter = Router()


userRouter.post("/users", createUser)
userRouter.get("/users", getUsers)
userRouter.get("/attendants", getAttendants)
userRouter.get("/users/:id", getUserById)
userRouter.patch("/users/:id", updateUserById )
userRouter.patch("/users/update-password/:id", updateUserPasswordById )
userRouter.delete("/users/:id" , deleteUserById)


export default userRouter