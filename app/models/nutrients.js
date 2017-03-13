var mongoose = require('mongoose');

var nutrientSchema = mongoose.Schema({
	name: {type: String, required: true},
	benefits: {type: String, required: true}
});

nutrientSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		name: this.name,
		benefits: this.benefits,
	};
}

var Nutrient = mongoose.model('Nutrient', nutrientSchema);

module.exports = {Nutrient};