const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 12);  // You can increase the salt rounds if needed
        const user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error); // Log the actual error for debugging
        res.status(500).json({ message: 'Something went wrong while registering' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, username: user.username });
    } catch (error) {
        console.error(error); // Log the actual error for debugging
        res.status(500).json({ message: 'Something went wrong while logging in' });
    }
});

module.exports = router;
