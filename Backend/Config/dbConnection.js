import mysql from "mysql"

//db Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "lab_project"

})
db.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("mySql connected");


})


export default db;