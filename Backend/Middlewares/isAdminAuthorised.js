import customError from "./Error.js";
import jwt from "jsonwebtoken";
import db from "../Config/dbConnection.js";

export const isAdminAuthenticated = async (req, res, next) => {
    // Authentication
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return next(new customError("You are not authenticated first", 400));
        }

        const decoded = await jwt.verify(token, process.env.JWT_KEY);
        const findUserQuery = "SELECT * FROM users WHERE user_id = ? AND role IN (?, ?)";

        db.query(findUserQuery, [decoded.id, "admin", "manager"], async (err, result) => {
            if (err) {
                return next(new customError("Error in authentication", 400));
            }
            if (!result || result.length === 0) {
                return next(new customError("You are not authenticated second", 400));
            }

            next();
        });
    } catch (error) {
        return next(new customError(error.message, 400));
    }
};
