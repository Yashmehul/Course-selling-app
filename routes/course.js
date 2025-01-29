const { Router }=require("express");
const courseRouter=Router();
courseRouter.post("/purchase",(req,res)=>{
    //hm course purchase krrhe isme hm backedn ko bhejnege post request ki haan
    //i want to buy this course and payment and all......
    res.json({
        mesage:"purchase successful"
    })
})

courseRouter.get("/preview",(req,res)=>{
     res.json({
        message:"this is all the courses"
    })
})
courseRouter.get("/bulk",(req,res)=>{
    res.json({
        msg:"All the courses that has been bought"
    })
})
module.exports={
    courseRouter:courseRouter
}