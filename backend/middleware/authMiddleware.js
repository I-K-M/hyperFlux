const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "token";

const authenticateUser = (req, res, next) => {
    const token = req.cookies.token; 
    if (!token) {
        return res.status(401).json({ error: "Missing token" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId; 
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = authenticateUser;
