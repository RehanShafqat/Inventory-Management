import { Router } from "express";
import { isAdminAuthenticated } from "../Middlewares/isAdminAuthorised.js";
import { addProduct, addSupplier, supplierOrder, removeSupplier, updateSupplierOrder, customerOrder, updateCustomerOrder, getSoldData, getSupplierDetails, getAllCustomerOrders, getAllProducts, getAllCategories, getTotalSales } from "../Controller/inventoryController.js";
const inventoryRouter = new Router();
inventoryRouter.post("/addSupplier", isAdminAuthenticated, addSupplier)
inventoryRouter.post("/removeSupplier", isAdminAuthenticated, removeSupplier) // requiers NTN_number of supplier
inventoryRouter.post("/addProduct", isAdminAuthenticated, addProduct) // just adds the product sets the quantity to zero ... after this order will be placed to supplier
inventoryRouter.post("/suplier/order", isAdminAuthenticated, supplierOrder)
inventoryRouter.get("/supplier/updateOrder/:order_id/:supplier_NTN", updateSupplierOrder) // updates supplier
inventoryRouter.post("/customer/order", customerOrder);
inventoryRouter.post("/customer/updateOrder/", isAdminAuthenticated, updateCustomerOrder);
inventoryRouter.get("/most-sold-categories/", isAdminAuthenticated, getSoldData)
inventoryRouter.get("/getSupplierDetails/", isAdminAuthenticated, getSupplierDetails)
inventoryRouter.get("/getAllCustomerOrders", isAdminAuthenticated, getAllCustomerOrders)
inventoryRouter.get("/getAllProducts", getAllProducts)
inventoryRouter.get("/getAllCategories/", getAllCategories)
inventoryRouter.get("/getTotalSales/", getTotalSales)
export default inventoryRouter;