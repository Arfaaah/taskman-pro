	const express = require('express');
	const mongoose = require('mongoose');
	const dotenv = require('dotenv');
	const userRoutes = require('./userRoutes');
	const taskRoutes = require('./taskRoutes');
	const path = require('path');

	dotenv.config();

	
	const app = express();
	const PORT = process.env.PORT || 3000;
	// Middleware
	app.use(express.json());
	
	// Connect to MongoDB
mongoose.connect('mongodb+srv://TodoApp:Todo122024@todo-cluster.jnn42.mongodb.net/?retryWrites=true&w=majority&appName=Todo-Cluster')
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Could not connect to MongoDB Atlas:', err));

	// Routes
	app.use('/api/users', userRoutes);
	app.use('/api/tasks', taskRoutes);
	
	// Start Server
	app.listen(PORT, () => {
	    console.log(`Server running on http://127.0.0.1:${PORT}`);
	});
