const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const SECRET_KEY = process.env.SECRET_KEY || "token";
require('dotenv').config();
const isProduction = process.env.NODE_ENV === 'production';

const prisma = new PrismaClient();

exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ 
            where: { email }
    });
    if (!user) {
        return res.status(404).json({ auth: false, token: null, message: "User not found." })
    }
    const validPassword = await bcrypt.compare( password, user.password);
    if (!validPassword) {
        return res.status(401).send({ auth: false, token: null, message: "Invalid password." })
    } else {
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "12h" });

    // Stocker le token JWT dans un cookie HTTP-Only
    res.cookie("token", token, {
        httpOnly: true, // JavaScript ne peut pas accéder au cookie
        secure: isProduction,   // Nécessite HTTPS
        sameSite: "Strict", // Protection contre CSRF
        maxAge: 12 * 60 * 60 * 1000 // Expire après 12h
    });
        return res.status(200).send({ auth: true });
    }
}   catch (error) {
    return res.status(500).send({ message: "Internal Server Error." })
    } 
}
exports.logoutController = (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful." });
};
exports.registerController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const isEmailAlreadyUsed = await prisma.user.findUnique({ 
            where: { email }
    });
    if (isEmailAlreadyUsed) {
        return res.status(409).json({ token: null, message: "Email address already used." })
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword }
        })
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "12h" });
    // Stocker le token JWT dans un cookie HTTP-Only
    res.cookie("token", token, {
        httpOnly: true, // JavaScript ne peut pas accéder au cookie
        secure: true,   // Nécessite HTTPS
        sameSite: "Strict", // Protection contre CSRF
        maxAge: 12 * 60 * 60 * 1000 // Expire après 12h
    });
        return res.status(201).send({ message: "User added to database." });
    }
    } catch (error) {
            console.error(error);
            return res.status(500).send({ message: "Internal Server Error." });
        } 
}