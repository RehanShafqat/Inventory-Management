import { Router } from "express";
import { isAdminAuthenticated } from "../Middlewares/isAdminAuthorised.js";
import { addSupplier, removeSupplier } from "../Controller/inventoryController.js";
const inventoryRouter = new Router();
inventoryRouter.post("/addSupplier", isAdminAuthenticated, addSupplier) 
inventoryRouter.post("/removeSupplier", isAdminAuthenticated, removeSupplier) // requiers NTN_number of supplier
// inventoryRouter.

// router.post()
export default inventoryRouter;