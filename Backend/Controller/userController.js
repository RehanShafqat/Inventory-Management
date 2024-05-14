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
                const hashedpassword = result[0].password;
                const isPassCorrect = await bcrypt.compare(password, hashedpassword);
                const isEmailCorrect = (email == result[0].email) ? true : false
                if (isPassCorrect && isEmailCorrect) {
                    const user = {
                        id: result[0].user_id,
                        role: result[0].role,
                        email: result[0].email,
                        username: result[0].username

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
    const cookie = req.cookies.access_token;
    if (!cookie) {
        return next(new customError("Cookie not found", 404))
    }
    res.status(200).cookie("access_token", null, { httpOnly: true, expires: new Date(Date.now()) }).json({
        success: true,
        message: "User logged out successfully"
    })
}
export const forgotPassword = (req, res, next) => {
    //get User by email
    const { email } = req.body
    if (!email) return next(new customError("Please enter the email", 400));
    const findUser = "SELECT*FROM users WHERE email = ? "
    db.query(findUser, [email], async (err, result) => {
        if (err) {
            return next(new customError(err.message, err.code || 400));
        }
        else if (result.length === 0) {
            console.log(result);
            return next(new customError("User not found", 400));
        }
        const user_id = result[0].user_id;
        const email = result[0].email;
        const token = jwt.sign({ id: user_id }, process.env.JWT_KEY, { expiresIn: "5m" })
        const link = `${process.env.CLIENT_URL}/reset/${token}`
        await sendEmail(email, "Password reset", `<html lang="en">

<body style="font-family: Arial, sans-serif; padding: 20px;">

    <div style="max-width: 600px; margin: 0 auto; background-color: #f7f7f7; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="text-align: center; color: #333;">Password Reset</h2>
        <p style="font-size: 16px; color: #666; text-align: center;">You have requested a password reset. Please click the button below to reset your password:</p>
        
        <div style="text-align: center; margin-top: 20px;">
            <a href=${link} style="display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; font-size: 16px; padding: 12px 24px; border-radius: 4px;">Reset Password</a>
        </div>
        
        <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">If you did not request a password reset, please ignore this email. No changes will be made to your account.</p>
    </div>

</body>
</html>` );
    })
    res.status(200).json({
        success: true,
        message: "Email sent successfully"
    })


}
// it is to reset password using jwt token and for the session
export const resetPassword = async (req, res, next) => {
    const { token, password } = req.body;
    if (!token || !password) {
        return next(new customError("Not all credentials passed", 400));
    }

    try {
        const result = jwt.verify(token, process.env.JWT_KEY);
        const id = result.id;

        const findUserQuery = "SELECT * FROM users WHERE user_id = ?";
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
            const passUpdateQuery = "UPDATE users SET password = ? WHERE user_id = ?";
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
    const token = req.cookies.access_token;
    if (!token) {
        return next(new customError("Token not found", 400));
    }
    try {
        const result = jwt.verify(token, process.env.JWT_KEY)
        const id = result.id;
        const query = "Select * from users where user_id = ? ";
        db.query(query, id, (err, result) => {
            if (err) {
                return next(new customError(err.message, 400));
            }
            if (result.length === 0) {
                return next(new customError("User not found", 404))
            }
            const { user_id, email, username, image_URL, role } = result[0]
            res.status(200).json({
                success: true,
                message: "User is valid",
                result: {
                    user_id, email, username, image_URL, role
                }
            })
        })


        console.log(id);



    } catch (error) {
        return next(new customError("invalid token", 400));
    }
}

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




