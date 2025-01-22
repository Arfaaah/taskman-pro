const mongoose = require('mongoose');

//Defining Task Schema
const taskSchema = new mongoose.Schema({
	    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	    title: { type: String, required: true },
	    description: { type: String, required: true },
	    deadline: { type: Date, required: true },
        	    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
        	    completed: { type: Boolean, default: false }
        	});
        	//Exporting the schema as model
        	module.exports = mongoose.model('Task', taskSchema);
        