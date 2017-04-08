var mongoose = require('mongoose');

var nutrientSchema = mongoose.Schema({
	name: {type: String, required: true},
	benefits: {type: String, required: true},
	nutrient_id: {type: String, required: true}
});

nutrientSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		name: this.name,
		benefits: this.benefits,
		nutrient_id: this.nutrient_id
	};
}

module.exports = mongoose.model('nutrients', nutrientSchema, 'nutrients')