const express = require('express');
const router = express.Router();
const { loginController, logoutController, registerController} = require("../controllers/authController");

router.get("/", (req, res) => {
    res.json({ message: "Auth route is active" });
});
router.post('/login', loginController);
router.post('/logout', logoutController);
router.post('/register', registerController);

module.exports = router;