var mongoose = require('mongoose');

var mealSchema = mongoose.Schema({
	foodId: {type: [String], required: true},
	servings: {type: Number},
	meals: {type: String},
	date: {type: Date, default: Date.now},
	userId: String
});

// mealSchema.methods.apiRepr = function() {
// 	return {
// 		id: this._id,
// 		foodId: this.foodId,
// 		servings: this.servings,
// 		meals: this.meals,
// 		date: this.date
// 	};
// }


module.exports = mongoose.model('Meal', mealSchema)