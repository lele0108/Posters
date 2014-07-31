// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var stripe = require('stripe')('sk_mmRSQtlVIWr9bYa7usQPiuaeOX7y9');
var Lob = require('Lob');
Lob = new Lob('test_74cdde84e4e9c73a11d92b9b8922001c982');
var app        = express();

// configure app
app.use(bodyParser());

var port     = process.env.PORT || 8080; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://admin:admin@kahana.mongohq.com:10043/poster_buyers'); // connect to our database
var Customer     = require('./app/models/customer');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'Private API, your calls will be futile' });	
});

// on routes that end in /bears
// ----------------------------------------------------
router.route('/buy')

	// create a bear (accessed at POST http://localhost:8080/bears)
	.post(function(req, res) {
		var customer = new Customer();		// create a new instance of the Bear model
		customer.name = req.body.name;  // set the bears name (comes from the request)
		customer.email = req.body.email;
		customer.address_line1 = req.body.address_line1;
		customer.address_line2 = req.body.address_line2;
		customer.address_city = req.body.address_city;
		customer.address_state = req.body.address_state;
		customer.address_zip = req.body.address_zip;
		customer.address_country = req.body.address_country;
		customer.phone = req.body.phone;
		customer.stripe_token = req.body.stripe_token;
		//stripe charge the credit card
		stripe.charges.create({
		  amount: 400,
		  currency: "usd",
		  card: customer.stripe_token, // obtained with Stripe.js
		  description: "Charge for test@example.com"
		}, function(err, charge) {
		  //async callback for stripe creating charge
		  if (!err && !customer.charge) {
		  	customer.charge = charge.paid;
		  	//lob call for creating customer
		  	Lob.addresses.create({
			  name: customer.name,
			  email: customer.email,
			  phone: customer.phone,
			  address_line1: customer.address_line1,
			  address_line2: customer.address_line2,
			  address_city: customer.address_city,
			  address_state: customer.address_state,
			  address_zip: customer.address_zip,
			  address_country: customer.address_country,
			}, function (err, address) {
			  //async callback for stripe address
			  customer.lobId = address.id;
			  if (!err) {
			  	//lob create job
			  	Lob.jobs.create({
				  name: 'Lob Poster Job',
				  from: 'adr_c20346129f86602e', //Can pass an ID
				  to: customer.lobId,
				  objects: ['obj_e67b63dce3e8f6fb']
				}, function (err, job) {
				  //async callback for lob job
				  if (job) {
					  customer.job = job.id;
					  console.log(customer.job)
					  customer.save(function(err) {
						if (err)
							res.json(400, { message: err });
						else 
							var response = "Poster has been purchased and sent to printing! Confirmation #" + customer._id;
							res.json({ message: response });
							console.log("SUCCESS");
					  });
				  }
				  else {
				  	res.json(400, { message: err});
				  }
				});
			  }
			  else {
			  	res.json(400, { message: err});
			  }
			});
		  }
		  else {
		  	res.json(400, { message: err});
		  }
		});
		
	});

	// get all the bears (accessed at GET http://localhost:8080/api/bears)
	/*.get(function(req, res) {
		Bear.find(function(err, bears) {
			if (err)
				res.send(err);

			res.json(bears);
		});
	});*/

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/status/:confirmation')

	// get the bear with that id
	.get(function(req, res) {
		Customer.findById(req.params.confirmation, function(err, customer) {
			if (err || !customer)
				res.send(400, { message: err });
			else {
				Lob.jobs.retrieve(customer.job, function (err, job) {
				  var response = "Status: " + job.status + ", Packaging: " + job.packaging.name;
				  res.send(response);
				});
			}
		});
	});

	// update the bear with this id
	/*.put(function(req, res) {
		Bear.findById(req.params.confirmation, function(err, bear) {

			if (err)
				res.send(err);

			bear.name = req.body.name;
			bear.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Bear updated!' });
			});

		});
	})

	// delete the bear with this id
	.delete(function(req, res) {
		Bear.remove({
			_id: req.params.bear_id
		}, function(err, bear) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});*/


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
