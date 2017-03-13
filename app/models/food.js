var mongoose = require('mongoose');

var foodSchema = mongoose.Schema({
	name: {type: String, required: true},
	meal: {type: String, required: true},
	nutrients: {type: Array[String], required: false},
});

foodSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		name: this.name,
		meal: this.meal,
		nutrients: this.nutrients,
	};
}

var Food = mongoose.model('Food', foodSchema);

module.exports = {Food};
