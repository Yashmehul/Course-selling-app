const { Router }=require("express");
const userRouter=Router();

userRouter.post("/signup",(req,res)=>{
    res.json({
        message:"Singup endpoint"
    })
})

userRouter.post("/singin",(Req,res)=>{
    res.json({
        message:"singin endpoint"
    })
})

userRouter.get("/purchases",(req,res)=>{
    res.json({
        message:"courses purchased"
    })
})

module.exports={
    userRouter:userRouter
}