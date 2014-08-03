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

	// create the controller and inject Angular's $scope
	hackerSupply.controller('mainController', function($scope, $http) {
		// create a message to display in our view
		//$scope.message = 'Everyone come and see how good I look!';
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

	hackerSupply.controller('adminController', function($scope) {
		//$('.header').hide();
	});

	//hackerSupply.controller('contactController', function($scope) {
		//$scope.message = 'Contact us! JK. This is just a demo.';
	//});
