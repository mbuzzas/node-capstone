var mongoose = require('mongoose');

var mealSchema = mongoose.Schema({
	foodId: {type: [String], required: true},
	meals: {type: String},
	date: {type: Date, default: Date.now},
	userId: String
});

module.exports = mongoose.model('Meal', mealSchema)