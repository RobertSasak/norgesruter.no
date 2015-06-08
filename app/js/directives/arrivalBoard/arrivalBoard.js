'use strict';

var directivesModule = require('../_index.js');
var angular = require('angular');

/**
 * @ngInject
 */
directivesModule.directive('arrivalBoard', function () {
	return {
		restrict: 'E',
		templateUrl: 'arrivalBoard/arrivalBoard.html',
		controller: function (ReiseInfo, $interval) {
			var vm = this;
			var updateInterval = 60000;

			var options = angular.extend([], {
				id: vm.id,
			}, vm.options);

			function getData() {
				ReiseInfo.arrivalBoard(options).then(function (data) {
					vm.board = data.ArrivalBoard.Arrival;
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
			autoUpdate: '=',
			options: '='
		},
		scope: {},
	};
});