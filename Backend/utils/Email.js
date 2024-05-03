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
            user: "rehanshafqat2004@gmail.com",
            pass: "fkej yjlw rixq xcem"
        }

    })
    const mailOptions = {
        from: {
            name: "inventory-node",
            address: "rehanshafqat2004@gmail.com",
        },
        to: `rehanshafqat12004@gmail.com`,
        subject: "Password Reset INVENTORY Management System",
        text: ``,
        html: `<p> ${link} </p>`,
        attachments: [{}]
    }


    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({
            message: "Email sent successfully"
        })
    } catch (error) {
        console.log("email not sent");
        return next(new customError(error, 400));

    }
}
export default sendEmail;