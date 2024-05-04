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
        else if (result.length === 0) {
            console.log(result);
            return next(new customError("User not found", 400));
        }
        const admin_id = result[0].admin_id;
        const email = result[0].email;
        const token = jwt.sign({ id: admin_id }, process.env.JWT_KEY, { expiresIn: "5m" })
        const link = `${process.env.CLIENT_URL}/reset/${token}`
        sendEmail(email, link, res, next);
    })
}
export const resetPassword = async (req, res, next) => {
    const { token, password } = req.body;
    if (!token || !password) {
        return next(new customError("Not all credentials passed", 400));
    }

    try {
        const result = jwt.verify(token, process.env.JWT_KEY);
        const id = result.id;

        const findUserQuery = "SELECT * FROM admins WHERE admin_id = ?";
        db.query(findUserQuery, [id], async (err, userResult) => {
            if (err) {
                return next(new customError("Error in database query", 400));
            }

            if (userResult.length === 0) {
                return next(new customError("User not found", 404));
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Update the password in the database
            const passUpdateQuery = "UPDATE admins SET password = ? WHERE admin_id = ?";
            db.query(passUpdateQuery, [hashedPassword, id], (err, updateResult) => {
                if (err) {
                    return next(new customError(err.message, 400));
                }

                res.status(200).json({
                    success: true,
                    message: "Password updated successfully"
                });
            });
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
