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
		controller: function ($scope, ReiseInfo, $interval) {
			var vm = this;
			var updateInterval = 60000;

			$scope.$watch(function () {
				return vm.id;
			}, function (id) {
				getData(id);
			});

			function getData(id) {
				var options = angular.extend([], {
					id: id,
				}, vm.options);

				ReiseInfo.departureBoard(options).then(function (data) {
					vm.board = data.DepartureBoard.Departure;
				});
			}

			if (vm.autoUpdate) {
				$interval(function () {
					getData(vm.id);
				}, updateInterval);
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