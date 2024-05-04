import express from "express";
import { userRegistration } from "../Controller/userRegistration.js"
import { forgotPassword, isTokenValid, resetPassword, userLogin, userLogout } from "../Controller/userController.js"
import { isAdminAuthenticated } from "../Middlewares/isAdminAuthorised.js";
const userRouter = express.Router();


userRouter.post("/admin/register/", userRegistration)
userRouter.post("/admin/login/", userLogin);
userRouter.get("/admin/logout/", isAdminAuthenticated, userLogout);
userRouter.post("/admin/forgotPassword/", forgotPassword);
userRouter.post("/admin/resetPassword/", resetPassword);
userRouter.post("/admin/isTokenValid/", isTokenValid)


// userRouter.get("/admin/check/", isAdminAuthenticated);


export default userRouter