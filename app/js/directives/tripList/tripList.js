'use strict';

var directivesModule = require('../_index.js');

/**
 * @ngInject
 */
directivesModule.directive('tripList', function (Trip) {
	return {
		restrict: 'E',
		templateUrl: 'tripList/tripList.html',
		controller: function ($scope) {
			var vm = this;

			$scope.$watch(function () {
				return vm.originId + ' ' + vm.destId + vm.options.date + vm.options.time;
			}, function () {
				reload(vm.originId, vm.destId, vm.options);
			});

			function reload(originId, destId, options) {
				if (originId && destId) {
					vm.isSearching = true;
					return Trip.get(originId, destId, options)
						.then(function (list) {
							vm.list = list;
						})
						.catch(function (error) {
							vm.error = error;
						})
						.finally(function () {
							vm.isSearching = false;
						});
				}
			}
		},
		controllerAs: 'ctrl',
		bindToController: {
			originId: '=',
			destId: '=',
			options: '='
		},
		scope: {},
	};
});