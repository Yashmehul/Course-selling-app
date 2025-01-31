const { Router }=require("express");
const { userMiddleware }=require("../middleware/user")
const { purchaseModel }=require("../db");
const courseRouter=Router();
const { courseModel }=require("../db");
const jwt=require("jsonwebtoken");

    //hm course purchase krrhe isme hm backedn ko bhejnege post request ki haan
    //i want to buy this course and payment and all......
    courseRouter.post("/purchase",userMiddleware,async(req,res)=>{
        const userId=req.userId;
        const courseId=req.body.courseId;
    
        await purchaseModel.create({
            userId:userId,
            courseId:courseId
        })
        
        res.json({
            message:"You have successfully purchased the course"
        })
    })
    courseRouter.get("/preview",async(req,res)=>{
        const courses=await courseModel.find({});
        res.json({
            courses,
            message:"All the available courses"
        })
    })
    console.log("jwt secret key:",process.env.JWT_USER_SECRET)
module.exports={
    courseRouter:courseRouter
}