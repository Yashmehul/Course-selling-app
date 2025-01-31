const { Router }=require("express");
const { userModel, purchaseModel, courseModel } = require("../db");
const userRouter=Router();
// const { userModel}=require("../db");
const jwt=require("jsonwebtoken");
const zod=require("zod"); 
const bcrypt=require("bcrypt");
const { userMiddleware } = require("../middleware/user");
require("dotenv").config();

const emailSchema=zod.string().email();
const passwordSchema=zod.string().min(6);
userRouter.post("/signup",async (req,res)=>{
    const{email,password,firstname,lastname}=req.body;
    
        const emailValidation=emailSchema.safeParse(email);
        const passwordValidation=passwordSchema.safeParse(password);
        if (!emailValidation.success || !passwordValidation.success) {
            return res.status(400).json({
                message: "Input is incorrect",
                errors: {
                    email: emailValidation.error?.issues || null,
                    password: passwordValidation.error?.issues || null,
                },
            });
        }

     const hshpassword=await bcrypt.hash(password,10);

     try{
        await userModel.create({
            email:email,
            password:hshpassword,
            firstName:firstname,
            lastName:lastname
        })
        res.status(201).json({
            msg:"Data stored successfully"
        })
     }
     catch(error){
        if(error.code===11000){
            res.status(400).json({msg:"Email already exists"});
        }
        else{
            res.status(500).json({msg:"Server error"});
        }
     }
})

userRouter.post("/signin",async(req,res)=>{
    const {email,password,firstname,lastname}=req.body;
    const user=await userModel.findOne({email:email});
    if(user&&await bcrypt.compare(password,user.password)){
        const token=await jwt.sign({
            id:user._id.toString()
        },process.env.JWT_USER_SECRET)
        res.status(201).json({
            message:"Signin successfull",
            token:token
        })
    }
    else{
        res.status(401).json({
            msg:"The user doesnt exist in the database"
        })
    }
})


userRouter.get("/purchases",userMiddleware,async(req,res)=>{
    const userId=req.userId;
    const purchase=await purchaseModel.find({
        userId:userId
    })
    if(!purchase.length>0){
        return res.status(404).json({
            msg:"You have no purchased course."
        })
    }
    const courseData=await courseModel.find({
        _id:{ $in:purchase.map(x=>x.courseId) }
    })
    return res.status(200).json({
        purchase,
        courseData,
        msg:"These are all the purchased course of yours.."
    })
})

module.exports={
    userRouter:userRouter
}