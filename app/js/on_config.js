'use strict';

/**
 * @ngInject
 */
function OnConfig($stateProvider, $locationProvider, $urlRouterProvider) {

	//HTML5 mode does not work on ghpages
	//$locationProvider.html5Mode(true);

	$stateProvider
		.state('trip', {
			url: '/trip?originId&originName&destId&destName',
			templateUrl: 'trip.html',
			controller: 'Trip',
			controllerAs: 'ctrl'
		})
		.state('planner', {
			templateUrl: 'planner.html',
			controller: 'Planner',
			controllerAs: 'planner',
			abstract: true
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
			url: '/trip/:originId/:destId?time&date',
			templateUrl: 'results.html',
			controller: 'Results',
			controllerAs: 'ctrl'
		})
		.state('departures', {
			url: '/departures/:id',
			templateUrl: 'departures.html',
			controller: 'Departures',
			controllerAs: 'ctrl'
		})
		.state('arrivals', {
			url: '/arrivals/:id',
			templateUrl: 'arrivals.html',
			controller: 'Arrivals as ctrl',
			controllerAs: 'ctrl'
		});

	$urlRouterProvider.otherwise('/planner');

}

module.exports = OnConfig;