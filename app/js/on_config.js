'use strict';

/**
 * @ngInject
 */
function OnConfig($stateProvider, $locationProvider, $urlRouterProvider) {

	$locationProvider.html5Mode(true);

	$stateProvider
		.state('trip', {
			url: '/trip',
			controller: 'Trip as ctrl',
			templateUrl: 'trip.html',
		})
		.state('planner', {
			template: '<ui-view/>',
			abstract: true,
		})
		.state('planner.from', {
			url: '/planner',
			templateUrl: 'from.html',
			controller: 'From',
			controllerAs: 'ctrl'
		})
		.state('planner.to', {
			url: '/planner/:originId',
			templateUrl: 'to.html',
			controller: 'To',
			controllerAs: 'ctrl',
		})
		.state('planner.time', {
			url: '/planner/:originId/:destId',
			templateUrl: 'time.html',
			controller: 'Time',
			controllerAs: 'ctrl',
		})
		.state('results', {
			url: '/trip/:originId/:destId?time=?&date=?',
			controller: 'Results as ctrl',
			templateUrl: 'results.html',
		})
		.state('departures', {
			url: '/departures/:id',
			controller: 'Departures as ctrl',
			templateUrl: 'departures.html',
		})
		.state('arrivals', {
			url: '/arrivals/:id',
			controller: 'Arrivals as ctrl',
			templateUrl: 'arrivals.html',
		});

	$urlRouterProvider.otherwise('/planner');

}

module.exports = OnConfig;