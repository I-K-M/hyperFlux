const express = require('express');
const router = express.Router();
const { 
    loginController, 
    logoutController, 
    registerController, 
    passwordResetController,
    passwordResetRequestController,
    checkAuthController 
} = require("../controllers/authController");
const authenticateUser = require("../middleware/authMiddleware");

router.get("/", (req, res) => {
    res.json({ message: "Auth route is active" });
});

router.get("/check", authenticateUser, checkAuthController);

router.post('/login', loginController);
router.post('/logout', logoutController);
router.post('/register', registerController);
router.post('/password-reset', passwordResetController);
router.post('/password-reset-request', passwordResetRequestController);

module.exports = router;