import customError from "../Middlewares/Error.js";
import bcrypt from "bcrypt";
import db from "../Config/dbConnection.js";

export const userRegistration = async (req, res, next) => {
    try {
        const { username, email, password, imgUrl } = req.body;

        if (!username || !password || !email) {
            return next(new customError("Please fill all the details", 400));
        }

        // Check if user with the provided email already exists
        const checkAvailabilityQuery = "SELECT * FROM admins WHERE email = ?";
        let isUserThere = false


        await db.query(checkAvailabilityQuery, [email], async (err, result) => {
            if (result.length > 0) {
                return next(new customError("user already there", 400))
            }
            const hashedPassword = await bcrypt.hash(password.toString(), 10);
            const insertUserQuery = "INSERT INTO admins (`username`, `email`, `password`, `image`) VALUES (?, ?, ?, ?)";
            const insertValues = [username, email, hashedPassword, imgUrl];
            await db.query(insertUserQuery, insertValues, (ERROR, RESULT) => {
                if (err) {
                    return next(new customError("Error in the database", 500));
                }
                return res.status(200).json({
                    success: true,
                    RESULT,
                    message: "User registered successfully"
                });
            })
        });


    } catch (error) {
        next(new customError(error.message, 400));
    }
};

