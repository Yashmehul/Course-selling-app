const { Router } = require("express");
const adminRouter = Router();
const { adminModel, userModel } = require("../db");
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

adminRouter.post("/courses", (req, res) => {
    res.json({ msg: "Admin course endpoint" });
});

adminRouter.get("/course/bulk", (req, res) => {
    res.json({ msg: "Admin all course access endpoint" });
});

module.exports = { adminRouter };
