'use strict';

var angular = require('angular');
/**
 * @ngInject
 */
function OnConfig($stateProvider, $locationProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {

	//HTML5 mode does not work on ghpages
	//$locationProvider.html5Mode(true);

	$urlMatcherFactoryProvider.type('stopName', {
		encode: function (str) {
			return str && str.replace(/ /g, '-').replace('/', '');
		},
		decode: function (str) {
			console.log(str);
			return str && str.replace(/-/g, ' ');
		},
		is: function (str) {
			return angular.isString(str) && str.indexOf('-') < 0;
		},
		pattern: /[^/]+/
	});

	$stateProvider
		.state('trip', {
			url: '/t/{originName:stopName}/{originId:[0-9]+}/{destName:stopName}/{destId:[0-9]+}?time&date',
			params: {
				originName: {
					value: null,
					squash: true
				},
				originId: {
					value: null,
					squash: true
				},
				destName: {
					value: null,
					squash: true
				},
				destId: {
					value: null,
					squash: true
				}
			},
			templateUrl: 'trip.html',
			controller: 'Trip',
			controllerAs: 'ctrl'
		});

	$urlRouterProvider.otherwise('/t');

}

module.exports = OnConfig;