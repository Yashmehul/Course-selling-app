const jwt = require("jsonwebtoken");

function userMiddleware(req, res, next) {
    const token = req.headers.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: "You are not signed in" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);

        req.userId = decoded.id; 
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}

module.exports = { userMiddleware };
