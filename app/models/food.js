var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
	name: {type: String, required: true},
	date: {type: String, required: true},
	meal: {type: String, required: true},
	nutrients: {type: Array, required: false},
	username: {type: String, required: true},
});

var Item = mongoose.model('Item', itemSchema);

module.exports = Item;