import express from "express"
import db from "./Config/dbConnection.js";
import cors from "cors"
import { config } from "dotenv";
import morgan from "morgan";
import userRouter from "./Routers/userRouter.js"
import { errorMiddleware } from "./Middlewares/Error.js";
import cookieParser from "cookie-parser";
const app = express();
config({ path: "./Config/.env" })




app.use(cors({                                        //enabling cors
    origin: [process.env.CLIENT_URL, process.env.BACKEND_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}))




app.listen(process.env.PORT, () => {
    console.log("app running on port " + process.env.PORT);
})



app.use(express.json())
app.use(cookieParser())


// routers
app.use("/api/version1/user", userRouter)






//custom Error
app.use(errorMiddleware)