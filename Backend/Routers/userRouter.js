import express from "express";
import { userRegistration } from "../Controller/userRegistration.js"
import { forgotPassword, isTokenValid, resetPassword, adminDelete, userLogin, userLogout, getAdmins } from "../Controller/userController.js"
import { isAdminAuthenticated } from "../Middlewares/isAdminAuthorised.js";
import { isManagerAuthenticated } from "../Middlewares/isManagerAuthenticated.js";
const userRouter = express.Router();

//manager routers
userRouter.post("/manager/admin/delete", isManagerAuthenticated, adminDelete)
userRouter.get("/manager/getAdmins", isManagerAuthenticated, getAdmins)



//customer registration
userRouter.post("/customer/register/", userRegistration)




//login for all the entities
userRouter.post("/login/", userLogin);





// admin routers
userRouter.get("/logout/", userLogout); //good
userRouter.post("/forgotPassword/", forgotPassword); // good
userRouter.post("/resetPassword/", resetPassword);//good
userRouter.post("/isTokenValid/", isTokenValid) // good



export default userRouter