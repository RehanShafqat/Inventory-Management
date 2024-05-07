import jwt from "jsonwebtoken";



const generateWebToken = (res, user) => {

    const token = jwt.sign({ id: user.user_id }, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRE })
    const cookieName = "access_token"
    res.status(200).cookie(cookieName, token, { httpOnly: true, expiresIn: new Date(Date.now() + process.env.JWT_EXPIRE * 24 * 60 * 60 * 1000) }).json({
        success: "true",
        message: "User logged in successfully",
        user,
        token
    })
}
export default generateWebToken;