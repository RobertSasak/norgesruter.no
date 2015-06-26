'use strict';

var directivesModule = require('../_index.js');
var angular = require('angular');
var moment = require('moment');
/**
 * @ngInject
 */
directivesModule.directive('tripList', function (ReiseInfo) {

	function normalize(list) {
		var r = [];

		angular.forEach(list, function (j) {
			var journey = {},
				first,
				last;


			journey.isDirect = !angular.isArray(j.LegList.Leg);

			if (journey.isDirect) {
				first = j.LegList.Leg.Origin;
				last = j.LegList.Leg.Destination;
				journey.legs = [normalizeLeg(j.LegList.Leg)];
			} else {
				first = j.LegList.Leg[0].Origin;
				last = j.LegList.Leg[j.LegList.Leg.length - 1].Destination;
				var legs = [];
				angular.forEach(j.LegList.Leg, function (l) {
					legs.push(normalizeLeg(l));
				});
				journey.legs = legs;
				journey.stops = j.LegList.Leg.length;
			}

			journey.startTime = first.time;
			journey.endTime = last.time;
			journey.startDate = first.date;
			journey.endDate = last.date;

			var startDateTime = journey.startDate + ' ' + journey.startTime;
			var endDateTime = journey.endDate + ' ' + journey.endTime;

			journey.duration = getDuration(startDateTime, endDateTime);
			r.push(journey);
		});
		return r;
	}

	function getDuration(start, end) {
		return moment.utc(moment(end).diff(start)).format('H[t] m[min]').replace('0t ', '');
	}

	function normalizeLeg(l) {
		var leg = {
			type: l.type,
			local: l.local,
			origin: normalizePlace(l.Origin),
			dest: normalizePlace(l.Destination)
		};

		var startDateTime = leg.origin.date + ' ' + leg.origin.time;
		var endDateTime = leg.dest.date + ' ' + leg.dest.time;
		leg.duration = getDuration(startDateTime, endDateTime);

		return leg;
	}

	function normalizePlace(o) {
		return {
			name: o.name,
			id: o.id,
			time: o.time,
			date: o.date
		};
	}

	return {
		restrict: 'E',
		templateUrl: 'tripList/tripList.html',
		controller: function ($scope) {
			var vm = this;

			$scope.$watch(function () {
				return vm.originId + ' ' + vm.destId + vm.options.date + vm.options.time;
			}, function (value) {
				if (value) {
					reload();
				}
			});

			function getResults(originId, destId, options) {
				var _options = angular.extend({}, {
					originId: originId,
					destId: destId,
				}, options);

				vm.isSearching = true;
				return ReiseInfo.trip(_options)
					.then(function (data) {
						return {
							data: normalize(data.TripList.Trip),
							error: data.TripList.errorText
						};
					})
					.catch(function (error) {
						console.log(error);
					})
					.finally(function () {
						vm.isSearching = false;
					});
			}

			function reload() {
				if (vm.originId && vm.destId) {
					getResults(vm.originId, vm.destId, vm.options).then(function (results) {
						vm.list = results.data;
						vm.error = results.error;
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