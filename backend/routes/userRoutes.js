const express = require('express');
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * ✅ Récupérer la session de l'utilisateur connecté.
 * Si la session n'existe pas encore, elle est créée automatiquement.
 */
router.get("/session", authenticateUser, async (req, res) => {
    try {
        let session = await prisma.conversationHistory.findFirst({
            where: { sessionId: req.userId },
        });

        if (!session) {
            session = await prisma.conversationHistory.create({
                data: { sessionId: req.userId, role: "system", content: "Conversation started" },
            });
        }

        res.json({ sessionId: session.sessionId });
    } catch (error) {
        console.error("Prisma error:", error);
        res.status(500).json({ error: "server error" });
    }
});

/**
 * ✅ Récupérer toutes les sessions de l'utilisateur connecté
 */
router.get("/sessions", authenticateUser, async (req, res) => {
    try {
        const sessions = await prisma.conversationHistory.findMany({
            where: { sessionId: req.userId },
            select: { sessionId: true, content: true, role: true, createdAt: true },
            orderBy: { createdAt: "desc" },
        });

        res.json(sessions);
    } catch (error) {
        console.error("Prisma error:", error);
        res.status(500).json({ error: "server error" });
    }
});

/**
 * ✅ Supprimer une session de l'utilisateur
 */
router.delete("/sessions/:sessionId", authenticateUser, async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (sessionId !== req.userId) {
            return res.status(403).json({ error: "Unauthorized action" });
        }

        await prisma.conversationHistory.deleteMany({ where: { sessionId } });

        res.json({ message: "Session deleted successfully." });
    } catch (error) {
        console.error("Prisma error:", error);
        res.status(500).json({ error: "server error" });
    }
});

/**
 * ✅ Récupérer les messages d'une session donnée
 */
router.get("/:sessionId", authenticateUser, async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (sessionId !== req.userId) {
            return res.status(403).json({ error: "Unauthorized access" });
        }

        const messages = await prisma.conversationHistory.findMany({
            where: { sessionId },
            orderBy: { createdAt: "asc" },
        });

        res.json(messages);
    } catch (error) {
        console.error("Prisma error:", error);
        res.status(500).json({ error: "server error" });
    }
});

/**
 * ✅ Sauvegarder un message dans une session
 */
router.post("/:sessionId", authenticateUser, async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { role, content } = req.body;

        if (!role || !content) {
            return res.status(400).json({ error: "Incomplete data." });
        }

        if (sessionId !== req.userId) {
            return res.status(403).json({ error: "Unauthorized action" });
        }

        await prisma.conversationHistory.create({
            data: { sessionId, role, content },
        });

        res.status(201).json({ message: "Message saved." });
    } catch (error) {
        console.error("Prisma error:", error);
        res.status(500).json({ error: "server error" });
    }
});

module.exports = router;
