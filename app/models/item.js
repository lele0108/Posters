var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ItemSchema   = new Schema({
	imgLarge: String,
	imgSmall: String,
	name: String,
	price: Number,
	desc: String,
	type: String,
	lobId: String,
});

module.exports = mongoose.model('Item', ItemSchema);