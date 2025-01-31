const { Router }=require("express");
const { PurchaseModel }=require("../db");
const courseRouter=Router();
    //hm course purchase krrhe isme hm backedn ko bhejnege post request ki haan
    //i want to buy this course and payment and all......
    courseRouter.get("/purchase",userMiddleware,userMiddleware,async(req,res)=>{
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
module.exports={
    courseRouter:courseRouter
}