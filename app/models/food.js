var mongoose = require('mongoose');

var foodSchema = new mongoose.Schema({
    name: {type: String},
    nutrients: {type: []}
});

foodSchema.methods.apiRepr = function() {
	return {
		name: this.name,
		nutrients: this.nutrients
	};
}


module.exports = mongoose.model('foods', foodSchema, 'foods')
