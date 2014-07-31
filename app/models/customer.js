var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CustomerSchema   = new Schema({
	name: String,
	address_line1: String,
	address_line2: String,
	address_city: String,
	address_state: String,
	address_zip: Number,
	address_country: String,
	email: String,
	phone: Number,
	lobId: String,
	stripe_token: String,
	charge: Boolean,
	job: String,
});

module.exports = mongoose.model('Customer', CustomerSchema);