import customError from "../Middlewares/Error.js"
import bcrypt from "bcrypt"
import db from "../Config/dbConnection.js"

export const userRegistration = async (req, res, next) => {
    try {

        const { username, email, password } = req.body
        if (!username || !password || !email) {
            return next(new customError("please fill all the details", 400));
        }
        //check for already available admin
        const checkAvailability = "SELECT * FROM admins WHERE email = ? ";
        db.query(checkAvailability, [email], (err, result) => {
            console.log("hello, ");
            if (result.length > 0) {
                console.log(result);
                return next(new customError("User already exists", 400));
            }

        })
        //add admin
        const sql = "INSERT INTO admins (`username`,`email`,`password`) VALUES (?)";
        const hashedPassword = await bcrypt.hash(password.toString(), 10)
        const values = [username, email, hashedPassword];
        db.query(sql, [values], (err, result) => {
            if (err) { return next(new customError(err.message, 400)) }
            return res.status(200).json({
                status: "success",
                result,
                message: "user Registered successfully"
            })
        })

    } catch (error) {
        next(new customError(error.message, 400));
    }
}