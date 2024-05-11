import nodemailer from "nodemailer"
import customError from "../Middlewares/Error.js"
const sendEmail = async (recipientMail, subject, html) => {
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
            name: "Admin Inventory Management",
            address: process.env.SENDER_EMAIL,
        },
        to: `${recipientMail}`,
        subject: `${subject}`,
        text: ``,
        html: `${html}`,
    }
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("email not sent");
    }
}
export default sendEmail;