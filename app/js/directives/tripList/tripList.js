'use strict';

var directivesModule = require('../_index.js');
var angular = require('angular');
var $ = require('jquery');

/**
 * @ngInject
 */
directivesModule.directive('tripList', function (Trip, $analytics, $timeout) {
	return {
		restrict: 'E',
		templateUrl: 'tripList/tripList.html',
		controller: function ($scope) {
			var vm = this;

			vm.list = [];

			$scope.$watch(function () {
				return vm.originId + ' ' + vm.destId + vm.options.date + vm.options.time;
			}, function () {
				vm.list = [];
				load(vm.originId, vm.destId, vm.options);
			});

			function load(originId, destId, options) {
				if (originId && destId) {

					var _options = angular.extend({}, options, getLast(vm.list));

					vm.isSearching = true;
					return Trip
						.get(originId, destId, _options)
						.then(function (list) {
							vm.list = vm.list.concat(list);
							vm.list = unique(vm.list);
							vm.error = undefined;
						})
						.catch(function (error) {
							vm.list = [];
							vm.error = error;
							if (error && error.status === 0) {
								vm.error = {
									code: 0,
									text: 'Offline'
								};
							}
						})
						.finally(function () {
							vm.isSearching = false;
						});
				}
			}

			vm.loadWithDelay = function () {
				if (vm.originId && vm.destId) {
					vm.isSearching = true;
					$timeout(function () {
						load(vm.originId, vm.destId, vm.options);
					}, 1000);
				}
			};

			function getLast(list) {
				if (list.length > 0) {
					var last = list[list.length - 1];
					return {
						time: last.startTime,
						date: last.startDate
					};
				} else {
					return {};
				}
			}

			function more() {
				if (!vm.isSearching) {
					$analytics.eventTrack('loadMore', {
						category: 'tripList',
					});
					load(vm.originId, vm.destId, vm.options);
				}
			}
			vm.more = more;

			function unique(list) {
				var seen = {};
				return list.filter(function (item) {
					return seen.hasOwnProperty(item.id) ? false : (seen[item.id] = true);
				});
			}

			$(window).scroll(function () {
				if (vm.list.length) {
					if ($(window).scrollTop() + $(window).height() === $(document).height()) {
						more();
					}
				}
			});
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