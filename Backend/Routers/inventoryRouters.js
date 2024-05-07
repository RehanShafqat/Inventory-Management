import { Router } from "express";
import { isAdminAuthenticated } from "../Middlewares/isAdminAuthorised.js";
import { addProduct, addSupplier, placeOrder, removeSupplier } from "../Controller/inventoryController.js";
const inventoryRouter = new Router();
inventoryRouter.post("/addSupplier", isAdminAuthenticated, addSupplier)
inventoryRouter.post("/removeSupplier", isAdminAuthenticated, removeSupplier) // requiers NTN_number of supplier
inventoryRouter.post("/addProduct", isAdminAuthenticated, addProduct) // just adds the product sets the quantity to zero ... after this order will be placed to supplier
inventoryRouter.post("/orderFromSupplier", isAdminAuthenticated, placeOrder)
// inventoryRouter.

// router.post()
export default inventoryRouter;