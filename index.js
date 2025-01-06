const express=require("express");
const app= express();
const { userRouter }=require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter }=require("./routes/adminRouter")
 
app.use("/api/v1/user",userRouter);
app.use("/api/v1/course",courseRouter);
app.use("/api/v1/admin",adminRouter)


app.listen(3000,()=>{
    console.log("server is listening :)");
});


