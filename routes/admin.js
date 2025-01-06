const { Router }=require("express");
const adminRouter=Router();

adminRouter.post("/signup",(req,res)=>{
    res.json({
        msg:"Admin signup enpoint"
    })
})

adminRouter.post("/signin",(req,res)=>{
    res.json({
        msg:"Admin signup ednpoint"
    })
})
adminRouter.post("/courses",(req,res)=>{
    res.json({
        msg:"Admin course endpoint"
    })
})
adminRouter.get("/course/bulk",(req,res)=>{
    res.json({
        msg:"Admin all course access endpoint"
    })
})

module.exports={
    adminRouter:adminRouter
}