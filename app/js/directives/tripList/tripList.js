'use strict';

var directivesModule = require('../_index.js');
var angular = require('angular');

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
					return Trip
						.get(originId, destId, options)
						.then(function (list) {
							vm.list = list;
						})
						.catch(function (error) {
							vm.list = [];
							vm.error = error;
						})
						.finally(function () {
							vm.isSearching = false;
						});
				}
			}

			function getLast(list) {
				var last = list[list.length - 1];
				return {
					time: last.startTime,
					date: last.startDate
				};
			}

			function loadMore() {
				var options = angular.extend({}, vm.options, getLast(vm.list));
				Trip
					.get(vm.originId, vm.destId, options)
					.then(function (list) {
						vm.list = vm.list.concat(list);
					});
			}

			vm.more = function () {
				loadMore();
			};
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