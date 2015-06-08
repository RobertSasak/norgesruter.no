'use strict';

var directivesModule = require('../_index.js');
var angular = require('angular');

/**
 * @ngInject
 */
directivesModule.directive('departureBoard', function () {
	return {
		restrict: 'E',
		templateUrl: 'departureBoard/departureBoard.html',
		controller: function (ReiseInfo, $interval) {
			var vm = this;
			var updateInterval = 60000;

			var options = angular.extend([], {
				id: vm.id,
			}, vm.options);

			function getData() {
				ReiseInfo.departureBoard(options).then(function (data) {
					vm.board = data.DepartureBoard.Departure;
				});
			}

			getData();

			if (vm.autoUpdate) {
				$interval(getData, updateInterval);
			}
		},
		controllerAs: 'ctrl',
		bindToController: {
			id: '=',
			options: '=',
			autoUpdate: '='
		},
		scope: {},
	};
});