
import customError from "./Error.js";
import jwt from "jsonwebtoken"
import db from "../Config/dbConnection.js";

export const isManagerAuthenticated = async (req, res, next) => {
    const token = req.cookies.managerToken;
    if (!token) {
        return next(new customError("You are not authenticated", 400));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const checkIndb = "Select*from users where role = ? and user_id = ? ";
        db.query(checkIndb, ["manager", decoded.id], (error, result) => {
            if (!result) {
                return next(new customError("You are not authenticated", 404))
            }
            next();
        })
    } catch (error) {
        return next(new customError(error.message, 400));
    }

}