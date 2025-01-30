const { Router } = require("express");
const adminRouter = Router();
const { adminModel, userModel, courseModel } = require("../db");
const { adminMiddleware }=require("../middleware/admin");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const bcrypt = require("bcrypt");
require("dotenv").config();

const emailSchema = zod.string().email();
const passwordSchema = zod.string().min(6);

adminRouter.post("/signup", async (req, res) => {
    const { email, password, firstname, lastname } = req.body;

    // Validate email and password
    const emailValidation = emailSchema.safeParse(email);
    const passwordValidation = passwordSchema.safeParse(password);
    if (!emailValidation.success || !passwordValidation.success) {
        return res.status(400).json({ msg: "Invalid email or password format" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await adminModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstname,
            lastName: lastname
        });
    } catch (e) {
        return res.status(400).json({ msg: "Email already exists" });
    }

    return res.json({ msg: "Admin signup successful. Data stored in the database." });
});

adminRouter.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    // Find admin in the database
    const admin = await adminModel.findOne({ email: email });

    if (admin && await bcrypt.compare(password, admin.password)) {
        const token = jwt.sign({ id: admin._id.toString() }, process.env.JWT_ADMIN_SECRET);
        return res.json({ msg: "Signin successful", token: token });
    }

    return res.status(404).json({ msg: "Invalid email or password" });
});

adminRouter.post("/course",adminMiddleware,async(req, res) => {
    const adminId=req.adminId;
    const{title,description,price,imageUrl}=req.body;
    const descriptionSchema=zod.string();
    const titleSchema=zod.string();
    const imageUrlSchema=zod.string().url().regex(/\.(jpeg|jpg|png|webp)$/i,"Must be a valid imageUrl")
    const priceSchema=zod.number().nonnegative();
    const titleValidation=titleSchema.safeParse(title);
    const descriptionValidation=descriptionSchema.safeParse(description);
    const imageUrlValidation=imageUrlSchema.safeParse(imageUrl);
    const priceValidation=priceSchema.safeParse(price);
    // ther is another way to do both schema defining and parsing it 
    //use--> const titleValidation=zod.string().safeParse(title)
    //lly-->const priceValidation=zod.number().nonnegative().safeParse(price)..... and so on...
    const errors=[];
    if(!titleValidation.success) errors.push(...titleValidation.error.errors);
    if(!descriptionValidation.success) errors.push(...descriptionValidation.error.errors);
    if(!imageUrlValidation.success) errors.push(...imageUrlValidation.error.errors);
    if(!priceValidation.success) errors.push(...priceValidation.error.errors);

    if(errors.length>0){
        return res.status(400).json({
            msg:"You have givenincorrect input",
            errors
        })
    }
   const course=await courseModel.create({
        title:title,
        description:description,
        price:price,
        imageUrl:imageUrl,
        creatorId:adminId
    })
    res.status(201).json({
        message:"Course created successfully",
        courseId:course._id
    })
});

adminRouter.put("/courses",adminMiddleware,async(req,res)=>{
try{
   const{title,description,imageUrl,price}=req.body;
    const course=await courseModel.findOne({title:title});
    if(!course){
        return res.status(404).json({
            msg:"Course not found"
        })

    }
    if(description) course.description=description;
    if(imageUrl) course.imageUrl=imageUrl;
    if(price) course.price=price;

    await course.save();
    res.send(course);
}catch(error){
    res.status(500).send(error);
}

})

adminRouter.get("/course/bulk",adminMiddleware ,async (req, res) => {
    const creatorId=req.adminId;
    const courses=await courseModel.find({creatorId:creatorId}); 
    if(courses.length>0){
        res.status(200).send(courses);
    }
    else{
        res.status(200).json({
            msg:"No courses found!"
        })
    }
    
});

module.exports = { adminRouter };
