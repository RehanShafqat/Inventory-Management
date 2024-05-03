import express from "express";
import { userRegistration } from "../Controller/userRegistration.js"
import { forgotPassword, resetPassword, userLogin, userLogout } from "../Controller/userController.js"
import { isAdminAuthenticated } from "../Middlewares/isAdminAuthorised.js";
const userRouter = express.Router();


userRouter.post("/admin/register/", userRegistration)
userRouter.post("/admin/login/", userLogin);
userRouter.get("/admin/logout/", isAdminAuthenticated, userLogout);
userRouter.post("/admin/forgotPassword/", forgotPassword);
userRouter.get("/admin/resetPassword/:token/", resetPassword);


// userRouter.get("/admin/check/", isAdminAuthenticated);


export default userRouter