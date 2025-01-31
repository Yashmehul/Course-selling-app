const express=require("express");
const mongoose=require("mongoose");
require("dotenv").config();
const app= express();
const { userRouter }=require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter }=require("./routes/admin")
const cookieParser=require("cookie-parser");
const limiter=require('./middleware/rate_limiter');
app.use(express.json())
app.use(limiter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/course",courseRouter);
app.use("/api/v1/admin",adminRouter);
const DB_URL=process.env.DB_URL;
async function main(){
await mongoose.connect(DB_URL)
app.listen(process.env.port,()=>{
    console.log("server is listening :)");
});
}

main();

