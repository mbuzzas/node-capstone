var mongoose = require('mongoose');

var mealSchema = mongoose.Schema({
	foodId: {type: String, required: true},
	servings: {type: String, required: true}
});

mealSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		foodId: this.foodId,
		servings: this.servings,
	};
}


module.exports = mongoose.model('Meal', mealSchema)