import customError from "../Middlewares/Error.js";
import bcrypt from "bcrypt";
import db from "../Config/dbConnection.js";

export const userRegistration = async (req, res, next) => {
    try {
        const { username, email, password, image_URL } = req.body;

        if (!username || !password || !email) {
            return next(new customError("Please fill all the details", 400));
        }

        // Check if user with the provided email already exists
        const checkAvailabilityQuery = "SELECT * FROM users WHERE email = ?";


        db.query(checkAvailabilityQuery, [email], async (err, result) => {
            if (result.length > 0) {
                return next(new customError("user already there", 400))
            }
            const hashedPassword = await bcrypt.hash(password.toString(), 10);
            const insertUserQuery = "INSERT INTO users (`email`, `role`, `image_URL` ,`password`, `username`) VALUES (?,?,?,?,?)";
            const insertValues = [email, "customer", image_URL, hashedPassword, username];
            db.query(insertUserQuery, insertValues, (ERROR, RESULT) => {
                if (ERROR) {
                    return next(new customError(ERROR.message, 500));
                }
                return res.status(200).json({
                    success: true,
                    RESULT,
                    message: "Customer registered successfully"
                });
            })
        });
    } catch (error) {
        next(new customError(error.message, 400));
    }
};

