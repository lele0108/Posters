// logic.js

	// create the module and name it hackerSupply
        // also include ngRoute for all our routing needs
	var hackerSupply = angular.module('hackerSupply', ['ngRoute']);
	var MainCtrl = function($scope, $timeout, ngProgress) { }

	// configure our routes
	hackerSupply.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'pages/home.html',
				controller  : 'mainController'
			})

			// route for the about page
			.when('/item', {
				templateUrl : 'pages/item.html',
				controller  : 'aboutController'
			});

			// route for the contact page
			//.when('/contact', {
			//	templateUrl : 'pages/contact.html',
			//	controller  : 'contactController'
			//});
	});

	// create the controller and inject Angular's $scope
	hackerSupply.controller('mainController', function($scope) {
		// create a message to display in our view
		//$scope.message = 'Everyone come and see how good I look!';
		/*$('.slider-contents').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: true,
			autoplaySpeed: 5000,
			arrows: true,
			accessibility: true,
		});*/
	});

	hackerSupply.controller('aboutController', function($scope) {
		//$scope.message = 'Look! I am an about page.';
	});

	//hackerSupply.controller('contactController', function($scope) {
		//$scope.message = 'Contact us! JK. This is just a demo.';
	//});
