import { createUnit, deleteUnitById, getUnitById, getUnits, updateUnitById } from "@/controllers/units.controller";
import { Router } from "express";

const unitRouter = Router()


unitRouter.post("/units", createUnit)
unitRouter.get("/units", getUnits)
unitRouter.get("/units/:id", getUnitById)
unitRouter.patch("/units/:id", updateUnitById )
unitRouter.delete("/units/:id" , deleteUnitById)


export default unitRouter