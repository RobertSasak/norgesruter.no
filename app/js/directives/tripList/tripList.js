'use strict';

var directivesModule = require('../_index.js');
var angular = require('angular');
var moment = require('moment');
/**
 * @ngInject
 */
directivesModule.directive('tripList', function () {

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
		return moment.utc(moment(end).diff(start)).format('H[t] m[min]');
	}

	function normalizeLeg(l) {
		var leg = {
			type: l.type,
			local: l.local,
			origin: normalizeOrigin(l.Origin),
			dest: normalizeOrigin(l.Destination)
		};

		var startDateTime = leg.origin.date + ' ' + leg.origin.time;
		var endDateTime = leg.dest.date + ' ' + leg.dest.time;
		leg.duration = getDuration(startDateTime, endDateTime);

		return leg;
	}

	function normalizeOrigin(o) {
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
		controller: function (ReiseInfo) {
			var vm = this;

			var options = angular.extend({}, {
				originId: vm.originId,
				destId: vm.destId,
			}, vm.options);

			ReiseInfo.trip(options).then(function (data) {
				vm.list = normalize(data.TripList.Trip);
				vm.error = data.TripList.errorText;
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