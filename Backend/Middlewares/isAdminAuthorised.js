import customError from "./Error.js";
import jwt from "jsonwebtoken"
import db from "../Config/dbConnection.js";

export const isAdminAuthenticated = async (req, res, next) => {
    //authentication
    try {
        const token = req.cookies.admin_token;
        if (!token) {
            return next(new customError("Admin not authenticated", 400));
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const findUserQuery = "SELECT * FROM admins WHERE admin_id = ?";

        db.query(findUserQuery, ["205057"], async (err, result) => {
            if (!result) {
                return next(new customError("You are not authorised", 400));
            }
            else {
                next();
            }
        });
    } catch (error) {
        return next(new customError(error.message, 400));
    }

}