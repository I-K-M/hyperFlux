const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.use(authenticateUser);

router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId },
      orderBy: { start: 'asc' },
    });
    res.json(tasks);
  } catch (error) {
    console.error('Prisma error:', error);
    res.status(500).json({ error: 'server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { project, start, end } = req.body;
    if (!start || !end) {
      return res.status(400).json({ error: 'Incomplete data' });
    }
    const task = await prisma.task.create({
      data: {
        userId: req.userId,
        project: project || 'Task',
        start: new Date(start),
        end: new Date(end),
      },
    });
    res.status(201).json(task);
  } catch (error) {
    console.error('Prisma error:', error);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;