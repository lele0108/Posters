// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var stripe = require('stripe')('sk_mmRSQtlVIWr9bYa7usQPiuaeOX7y9');
var Lob = require('./node_modules/lob/lib/lob');
Lob = new Lob('test_74cdde84e4e9c73a11d92b9b8922001c982');
var app        = express();

// configure app
app.use(bodyParser());

var port     = process.env.PORT || 8080; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://admin:admin@kahana.mongohq.com:10043/poster_buyers'); // connect to our database
var Customer     = require('./app/models/customer');
var Item         = require('./app/models/item');

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

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
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
		customer.itemId = req.body.item;
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
			  	Item.findById(customer.itemId, function(err, item) {
					Lob.jobs.create({
					  name: 'Lob Poster Job',
					  from: 'adr_c20346129f86602e', //Can pass an ID
					  to: customer.lobId,
					  objects: [item.lobId]
					}, function (err, job) {
					  //async callback for lob job
					  if (job) {
						  customer.job = job.id;
						  console.log(customer.job)
						  customer.save(function(err) {
							if (err)
								res.json(400, { message: err });
							else 
								res.json({ message: "Poster has been purchased and sent to printing!", confirmation: customer._id});
								console.log("SUCCESS");
						  });
					  }
					  else {
					  	res.json(400, { message: err});
					  }
					});
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

// on routes that end in /status/:confirmation
// ----------------------------------------------------
router.route('/address')

	// get the bear with that id
	.post(function(req, res) {
		console.log(req.body);
		Lob.verification.verify({
		  address_line1: req.body.address_line1,
		  address_line2: req.body.address_line2,
		  address_city: req.body.address_city,
		  address_state: req.body.address_state,
		  address_zip: req.body.address_zip,
		  address_country: req.body.address_country,
		}, function (err, result) {
		  if (err) 
		  	res.json(400, { message: err });
		  else 
		  	res.json({ address: result.address });
		});
	});

// on routes that end in /status/:confirmation
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
				  res.send({ name: customer.name, status: job.status, packaging: job.packaging.name, tracking: job.tracking});
				});
			}
		});
	});


//create item
router.route('/item/add') 

	.post(function(req, res) {
		var item = new Item();
		item.imgLarge = req.body.imgLarge;
		item.imgSmall = req.body.imgSmall;
		item.name = req.body.name;
		item.price = req.body.price;
		item.desc = req.body.desc;
		item.type = req.body.type;
		item.lobId = req.body.lobId;
		item.save(function(err) {
			if (err)
				res.json(400, { message: err });
			else {
				res.json({ message: "Item Created!"});
			}
		});
	});

//get items
router.route('/item') 

	.get(function(req, res) {
		if (req.query.limit != null) {
			var q = Item.find().limit(req.query.limit);
			q.exec(function(err, posts) {
			     if (err) {
			     	res.json(err);
			     }
			     else 
			     	res.json(posts);
			});
		}
		else {
			Item.find(function(err, item) {
				if (err)
					res.send(err);

				res.json(item);
			});
		}
	});

//get specific item
router.route('/item/:id')

	// get the bear with that id
	.get(function(req, res) {
		Item.findById(req.params.id, function(err, item) {
			if (err || !item)
				res.send(400, { message: err });
			else {
				res.send(item);
			}
		});
	});

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

app.use(express.static(__dirname + '/client'));

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
