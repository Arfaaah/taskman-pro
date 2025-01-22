const express = require('express');
const jwt = require('jsonwebtoken');
const Task = require('./Task');
const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error("Token verification failed:", error);  // Log for internal use
        res.status(400).json({ message: 'Invalid token' });
    }
};

// Get all tasks
router.get('/', verifyToken, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId });
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);  // Log for internal use
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// Add a task
router.post('/', verifyToken, async (req, res) => {
    try {
        const { title, description, deadline, priority } = req.body;
        const task = new Task({ userId: req.userId, title, description, deadline, priority });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.error("Error adding task:", error);  // Log for internal use
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// Update a task
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { title, description, deadline, priority, completed } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (task.userId.toString() !== req.userId) return res.status(401).json({ message: 'Unauthorized' });

        task.title = title || task.title;
        task.description = description || task.description;
        task.deadline = deadline || task.deadline;
        task.priority = priority || task.priority;
        task.completed = completed !== undefined ? completed : task.completed;

        await task.save();
        res.status(200).json(task);
    } catch (error) {
        console.error("Error updating task:", error);  // Log for internal use
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// Delete a task
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (task.userId.toString() !== req.userId) return res.status(401).json({ message: 'Unauthorized' });

        await task.deleteOne();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error("Error deleting task:", error);  // Log for internal use
        res.status(500).json({ message: 'Something went wrong' });
    }
});

module.exports = router;
