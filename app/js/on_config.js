'use strict';

/**
 * @ngInject
 */
function OnConfig($stateProvider, $locationProvider, $urlRouterProvider) {

	//HTML5 mode does not work on ghpages
	//$locationProvider.html5Mode(true);

	$stateProvider
		.state('trip', {
			url: '/trip?originId&originName&destId&destName&time&date',
			templateUrl: 'trip.html',
			controller: 'Trip',
			controllerAs: 'ctrl'
		});

	$urlRouterProvider.otherwise('/trip');

}

module.exports = OnConfig;