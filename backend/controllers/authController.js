const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const SECRET_KEY = process.env.SECRET_KEY || "token";
require('dotenv').config();
const isProduction = process.env.NODE_ENV === 'production';

const prisma = new PrismaClient();

exports.checkAuthController = (req, res) => {
    try {
        res.status(200).json({ auth: true });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ 
            where: { email }
        });
        if (!user) {
            return res.status(404).json({ auth: false, token: null, message: "User not found." })
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).send({ auth: false, token: null, message: "Invalid password." })
        } else {
            const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "12h" });

            res.cookie("token", token, {
                httpOnly: true, 
                secure: isProduction,
                sameSite: "Strict", 
                maxAge: 12 * 60 * 60 * 1000 
            });
            return res.status(200).send({ auth: true });
        }
    } catch (error) {
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
    
    res.cookie("token", token, {
        httpOnly: true, 
        secure: true,   
        sameSite: "Strict", 
        maxAge: 12 * 60 * 60 * 1000
    });
        return res.status(201).send({ message: "User added to database." });
    }
    } catch (error) {
            console.error(error);
            return res.status(500).send({ message: "Internal Server Error." });
        } 
}

exports.passwordResetController = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ 
            where: { email }
    }) 
    if (!user) {
        return res.status(404).json({ auth: false, token: null, message: "Error while resetting password." })
    } else {
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
        const resetLink = `http://localhost:3000/password-reset?token=${token}`;
        const emailContent = `
        <p>Hello,</p>
        <p>You are receiving this email because you (or someone else) has requested a password reset for your account.</p>
        <p>This password reset link will expire in 1 hour.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">RESET MY PASSWORD</a>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
        <p>Best regards,</p>
        <p>The HyperFlux Team</p>
        `;
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: emailContent
        };
        await transporter.sendMail(mailOptions);
        return res.status(200).send({ message: "Password reset email sent." });
    } 
} catch (error) {
    return res.status(500).send({ message: "Internal Server Error." })
    };
}

exports.passwordResetRequestController = async (req, res) => {
    try {
        const { temporaryToken, password } = req.body;
        const decoded = jwt.verify(temporaryToken, SECRET_KEY);
        const userId = decoded.userId;
        const user = await prisma.user.findUnique({ 
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({ auth: false, token: null, message: "User not found." })
        } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.update({
            where: { id: userId }, 
            data: { password: hashedPassword }
        })
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "12h" });
    
    res.cookie("token", token, {
        httpOnly: true, 
        secure: true,   
        sameSite: "Strict", 
        maxAge: 12 * 60 * 60 * 1000
    });
        return res.status(200).send({ message: "Password reset successful." });
    }
    } catch (error) {
            console.error(error);
            return res.status(500).send({ message: "Internal Server Error." });
        } 
}