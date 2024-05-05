import generateWebToken from "../utils/JWT.js";
import db from "../Config/dbConnection.js";
import customError from "../Middlewares/Error.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import sendEmail from "../utils/Email.js";
export const userLogin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new customError("Please fill all the fields", 400));
    }
    const findUserQuery = "SELECT * FROM users WHERE email = ?";
    db.query(findUserQuery, [email], async (err, result) => {
        try {
            if (result && result.length > 0) {
                console.log(result);
                const hashedpassword = result[0].password;
                const isPassCorrect = await bcrypt.compare(password, hashedpassword);
                const isEmailCorrect = (email == result[0].email) ? true : false
                if (isPassCorrect && isEmailCorrect) {
                    const user = {
                        id: result[0].user_id,
                        role: result[0].role,
                        email: result[0].email

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
} // it is to check during reset password

export const adminDelete = (req, res, next) => {
    const { user_id } = req.body
    if (!user_id) {
        return next(new customError("user_id not found", 404));
    }
    const DELETE_QUERY = "DELETE FROM users WHERE user_id = ?";
    db.query(DELETE_QUERY, [user_id], (error, result) => {
        if (error) {
            return next(new customError(error.message, 400));
        }
        res.status(200).json({
            success: true,
            message: "user deleted successfully",
            result
        })
    })
}
export const getAdmins = (req, res, next) => {
    const query = "SELECT*FROM users where role = ?";
    db.query(query, ["admin"], (err, result) => {
        if (err) {
            return next(new customError(err.message, 400));
        }
        res.status(200).json({
            success: true,
            adminsList: result
        })
    })
}
