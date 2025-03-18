const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    const token = req.cookies.token; // <-- get token from cookie

    if (!token) {
        return res.status(401).json({ error: "Missing token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // <-- user ID in `req.userId`
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = authenticateUser;
