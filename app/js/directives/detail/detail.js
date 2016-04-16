'use strict';

var directivesModule = require('../_index.js');
var angular = require('angular');

/**
 * @ngInject
 */
directivesModule.directive('detail', function () {
	return {
		restrict: 'E',
		templateUrl: 'detail/detail.html',
		controller: function ($scope, ReiseInfo) {
			var vm = this;

			$scope.$watch(function () {
				return vm.reference;
			}, function (reference) {
				getData(reference);
			});

			function getData(reference) {
				if (reference) {
					var options = angular.extend([], {
						ref: reference,
					}, vm.options);

					ReiseInfo.journeyDetail(options).then(function (data) {
						vm.data = data && data.JourneyDetail;
					});
				}
			}
		},
		controllerAs: 'ctrl',
		bindToController: {
			reference: '=',
		},
		scope: {},
	};
});