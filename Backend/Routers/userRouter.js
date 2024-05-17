import express from "express";
import { userRegistration } from "../Controller/userRegistration.js"
import { forgotPassword, resetPassword, adminDelete, userLogin, userLogout, getAdmins, changeProfile, getAllUsers, addAdmin, isTokenValidForReset, getUserDetails } from "../Controller/userController.js"
import { isManagerAuthenticated } from "../Middlewares/isManagerAuthenticated.js";
const userRouter = express.Router();

//manager routers
userRouter.post("/manager/admin/delete", isManagerAuthenticated, adminDelete)
userRouter.get("/manager/getAdmins", isManagerAuthenticated, getAdmins)
userRouter.post("/manager/addAdmin", isManagerAuthenticated, addAdmin)



//customer registration
userRouter.post("/customer/register/", userRegistration)




//login for all the entities
userRouter.post("/login/", userLogin);
userRouter.get("/details", getUserDetails);
userRouter.post("/change/profileImage", changeProfile)




// admin routers
userRouter.get("/logout/", userLogout); //good
userRouter.post("/forgotPassword/", forgotPassword); // good
userRouter.post("/resetPassword/", resetPassword);//good
userRouter.post("/isTokenValid/", isTokenValidForReset) // good
userRouter.get("/getAllUsers", getAllUsers);


export default userRouter