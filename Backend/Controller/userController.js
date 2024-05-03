// Import necessary modules
import generateWebToken from "../utils/JWT.js";
import db from "../Config/dbConnection.js";
import customError from "../Middlewares/Error.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import sendEmail from "../utils/Email.js";
export const userLogin = async (req, res, next) => {
    const { username, password, admin_id } = req.body;
    if (!username || !password || !admin_id) {
        return next(new customError("Please fill all the fields", 400));
    }

    const findUserQuery = "SELECT * FROM admins WHERE admin_id = ?";
    db.query(findUserQuery, [admin_id], async (err, result) => {
        try {
            if (result && result.length > 0) {
                const hashedpassword = result[0].password;
                const isPassCorrect = await bcrypt.compare(password, hashedpassword);
                const isNameCorrect = username == result[0].username ? true : false
                if (isPassCorrect && isNameCorrect) {
                    const user = {
                        username: result[0].username,
                        admin_id: result[0].admin_id
                    };

                    generateWebToken(res, user);
                } else {
                    return next(new customError("Wrong Username or Password", 400));
                }
            } else {
                return next(new customError("User not found", 400));
            }
        } catch (error) {
            return next(new customError(error.message, 400));
        }
    });
}
export const userLogout = (req, res, next) => {
    res.status(200).cookie("admin_token", null, { httpOnly: true, expires: new Date(Date.now()) }).json({
        success: true,
        message: "Admin logged out successfully"
    })
}
export const forgotPassword = (req, res, next) => {

    //get User by email

    const { email } = req.body

    if (!email) return next(new customError("Please enter the email", 400));
    const findUser = "SELECT*FROM admins WHERE email = ? "



    db.query(findUser, [email], async (err, result) => {
        if (err) {
            return next(new customError(err.message, err.code || 400));
        }
        else if (result.length == 0) {
            return next(new customError("User not found", 400));
        }
        const admin_id = result[0].admin_id;
        const email = result[0].email;
        const token = jwt.sign({ id: admin_id }, process.env.JWT_KEY, { expiresIn: "30m" })
        const link = `http://localhost:5000/api/version1/user/admin/resetPassword/${token}`

        sendEmail(email, link, res, next);

    })





    // res.status(200).json({
    //     admin_id,
    //     email,
    //     message: "its running"

    // })

}
export const resetPassword = (req, res, next) => {
    const { token } = req.params;



    if (!token) {
        return next(new customError("ERROR: Not all credentials passed", 400));
    }

    //verify token
    try {
        const result = jwt.verify(token, process.env.JWT_KEY);
        const id = result.id;
        const findUserQuery = "SELECT * FROM admins WHERE admin_id = ?";
        db.query(findUserQuery, [id], (err, result) => {
            if (err) {
                return next(new customError("ERROR IN DATABASE QUERY", 400));
            }

            if (result.length === 0) {
                return next(new customError("User not found", 404)); // Use 404 for not found
            }
            res.status(200).json({
                message: "Password can be reset Now"
            })

        });






    } catch (error) {
        return next(new customError(error.message, 400));
    }





};
export const isTokenValid = (req, res, next) => {
    const { token } = req.body;
    if (!token) {
        return next(new customError("Token not found", 400));
    }
    try {
        const result = jwt.verify(token, process.env.JWT_KEY)
        res.status(200).json({
            success: "true",
            message: "token is valid"
        })
    } catch (error) {
        return next(new customError("invalid token", 400));
    }
}
