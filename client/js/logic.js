// logic.js

	// create the module and name it hackerSupply
        // also include ngRoute for all our routing needs
	var hackerSupply = angular.module('hackerSupply', ['ngRoute']);

	// configure our routes
	hackerSupply.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'pages/home.html',
				controller  : 'mainController'
			})

			// route for the about page
			.when('/item/:itemId', {
				templateUrl : 'pages/item.html',
				controller  : 'itemController'
			})

			.when('/login', {
				templateUrl: 'pages/login.html',
				controller: 'loginController'
			})

			.when('/buy/:itemId', {
				templateUrl: 'pages/buy.html',
				controller: 'buyController'
			})

			.when('/confirmation/:confirmation', {
				templateUrl: 'pages/confirmation.html',
				controller: 'confirmationController'
			})

			.when('/admin', {
				templateUrl: 'pages/admin.html',
				controller: 'adminController'
			});

			// route for the contact page
			//.when('/contact', {
			//	templateUrl : 'pages/contact.html',
			//	controller  : 'contactController'
			//});
	});

	hackerSupply.controller('indexController', function($scope, $route) {
	});

	// create the controller and inject Angular's $scope
	hackerSupply.controller('mainController', function($scope, $http) {
		// create a message to display in our view
		//$scope.message = 'Everyone come and see how good I look!';
		$('.header').show();
		$('.footer').show();
		$('.slider-contents').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: true,
			autoplaySpeed: 5000,
			arrows: true,
			accessibility: true,
		});
		$scope.myItems = {};
		$http({method: 'GET', url: 'http://hackerposter.herokuapp.com/api/item/'}).
		    success(function(data, status, headers, config) {
		      $scope.myItems = data;
		      console.log($scope.myItems);
		    }).
		    error(function(data, status, headers, config) {
		      console.log(status);
		});
	});

	hackerSupply.controller('itemController', function($scope, $http, $routeParams) {
		//$scope.message = 'Look! I am an about page.';
		$('.header').show();
		$('.footer').show();
		$scope.hide = false;
		$scope.item = {};
		$scope.reconmend = {};
		var url = "http://hackerposter.herokuapp.com/api/item/" + $routeParams.itemId;
		console.log(url);
		$http({method: 'GET', url: url}).
		    success(function(data, status, headers, config) {
		      $scope.item = data;
		      console.log($scope.item);
		    }).
		    error(function(data, status, headers, config) {
		      console.log(status);
		});
		$http({method: 'GET', url: 'http://hackerposter.herokuapp.com/api/item?limit=4'}).
		    success(function(data, status, headers, config) {
		      $scope.reconmend = data;
		      console.log($scope.item);
		    }).
		    error(function(data, status, headers, config) {
		      console.log(status);
		});

	});

	hackerSupply.controller('buyController', function($scope, $http, $routeParams, $location) {
		Stripe.setPublishableKey('pk_6lp9e39ut8xka2FbqeGdTHNCF1b0X');
		$scope.item = {};
		$scope.details = {};
		var url = "http://hackerposter.herokuapp.com/api/item/" + $routeParams.itemId;
		console.log(url);
		$http({method: 'GET', url: url}).
		    success(function(data, status, headers, config) {
		      $scope.item = data;
		      console.log($scope.item);
		    }).
		    error(function(data, status, headers, config) {
		      console.log(status);
		});
		$scope.order = function(user) {
			console.log(user);
			var details = angular.copy(user);
			Stripe.card.createToken({
			  number: details.card_number,
			  cvc: details.card_cvc,
			  exp_month: details.card_month,
			  exp_year: details.card_year
			}, stripeResponseHandler);
			function stripeResponseHandler(status, response) {
		        if (response.error) {
		          // Show the errors on the form
		          console.log("error stripe");
		        } else {
		          $http({method: 'POST', url: 'http://hackerposter.herokuapp.com/api/buy', data: {"name": details.name, "address_line1": details.address_line1, "address_line2": details.address_line2, "address_city": details.address_city, "address_state": details.address_state, "address_zip": details.address_zip, "address_country": "US", "email": details.email, "phone": details.phone, "stripe_token": response.id}}).
				    success(function(data, status, headers, config) {
				    	var view = "/confirmation/" + data.confirmation;
				       	$location.path(view); // path not hash
				    }).
				    error(function(data, status, headers, config) {
				      // called asynchronously if an error occurs
				      // or server returns response with an error status.
				      console.log(data);
				  });
		        }
		    }
		};
	});

	hackerSupply.controller('confirmationController', function($scope, $routeParams, $http) {
		$scope.information = {};
		$scope.number = $routeParams.confirmation;
		var url = 'http://hackerposter.herokuapp.com/api/status/' + $routeParams.confirmation;
		$http({method: 'GET', url: url}).
		    success(function(data, status, headers, config) {
		      $scope.information = data;
		      console.log($scope.information);
		    }).
		    error(function(data, status, headers, config) {
		      console.log(status);
		});
	});

	hackerSupply.controller('adminController', function($scope) {
		$scope.hide = true;
		$scope.bodyStyle = {background: "black !important"};
		$('.header').hide();
		$('.footer').hide();
	});

	hackerSupply.controller('loginController', function ($scope) {
		$('.header').hide();
		$('.footer').hide();
	});

	//hackerSupply.controller('contactController', function($scope) {
		//$scope.message = 'Contact us! JK. This is just a demo.';
	//});
