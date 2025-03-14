const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
    const token = req.cookies?.token; // gets cookie

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
        req.user = decoded.userId; // adds userId in req.user
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
