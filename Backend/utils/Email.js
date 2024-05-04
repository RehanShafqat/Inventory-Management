import nodemailer from "nodemailer"
import customError from "../Middlewares/Error.js"
const sendEmail = async (recipientMail, link, res, next) => {
    //create a transporter (a service that will send email)
    const transporter = new nodemailer.createTransport({
        service: "gmail",
        host: "rehanshafqat2004@gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD
        }
    })
    const mailOptions = {
        from: {
            name: "Admin Password Reset",
            address: process.env.SENDER_EMAIL,
        },
        to: `rehanshafqat12004@gmail.com`,
        subject: "Password Reset Inventory Management System",
        text: ``,
        html: `
        <b>YOUR RESET PASSWORD LINK</b>
        <p> ${link} </p>`,
    }
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ // expire after 5 mins
            message: "Email sent successfully",
            
        })
    } catch (error) {
        console.log("email not sent");
        return next(new customError(error, 400));

    }
}
export default sendEmail;