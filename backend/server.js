const express = require('express');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const app = express();
const PORT = process.env.NODE_ENV === 'test' ? 0 : process.env.PORT || 3000;
const cors = require('cors');
const cookieParser = require("cookie-parser");
const { Ollama } = require("@langchain/ollama");

app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'http://[::1]:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  }));
app.use(express.json()); 

app.get("/", (req, res) => {
    res.status(200).json({ message: "welcome to the API 🚀" });
});

app.use('/ping', (req, res) => {
    res.status(200).json({ message: "Server is up and running." });
})
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

/* AI */
app.use('/api/conversation', userRoutes);

const model = new Ollama({ model: "mistral" });
app.post("/chat", async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: "Empty message" });
    }
    console.log("Message received:", message);
    try {
        const response = await model.invoke(message);
        console.log("mistral answer :", response);
        res.json({ response });
    } catch (error) {
        console.error("AI error :", error);
        res.status(500).json({ error: "server error" });
    }
});

app.use('*', (req, res) => {
    res.status(404).json({ message: "This URL doesn't exist." });
});
/* global errors handler  */
app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({ message: 'An internal server error occurred.' });
});
/* Only start the server if not in test mode */
let server;
if (process.env.NODE_ENV !== 'test') {
    server = app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}/`);
    });
}
module.exports = { app, server };