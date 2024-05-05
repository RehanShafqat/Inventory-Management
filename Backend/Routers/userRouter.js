import express from "express";
import { userRegistration } from "../Controller/userRegistration.js"
import { forgotPassword, isTokenValid, resetPassword, adminDelete, userLogin, userLogout, getAdmins } from "../Controller/userController.js"
import { isAdminAuthenticated } from "../Middlewares/isAdminAuthorised.js";
import { isManagerAuthenticated } from "../Middlewares/isManagerAuthenticated.js";
const userRouter = express.Router();

//manager routers
userRouter.post("/manager/admin/register/", isManagerAuthenticated, userRegistration)
userRouter.post("/manager/admin/delete", isManagerAuthenticated, adminDelete)
userRouter.get("/manager/getAdmins", isManagerAuthenticated, getAdmins)





userRouter.post("/login/", userLogin);



// admin routers
userRouter.get("/admin/logout/", isAdminAuthenticated, userLogout); //good
userRouter.post("/admin/forgotPassword/", forgotPassword); // good
userRouter.post("/admin/resetPassword/", resetPassword);//good
userRouter.post("/admin/isTokenValid/", isTokenValid) // good

// userRouter.post("/test", isManagerAuthenticated);

// userRouter.get("/admin/check/", isAdminAuthenticated);


export default userRouter