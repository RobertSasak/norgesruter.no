'use strict';

var servicesModule = require('./_index.js');
var angular = require('angular');
var moment = require('moment');

function getDuration(start, end) {
    return moment.utc(moment(end).diff(start)).format('H[t] m[min]').replace('0t ', '');
}

function normalizePlace(o) {
    return {
        name: o.name,
        id: o.id,
        time: o.time,
        date: o.date
    };
}

function extractReference(reference) {
    reference = reference.replace(/%2F/g, '-');
    var match = reference.match(/\?ref=(.*)\%3Fdate%3D([0-9]{4}-[0-9]{2}-[0-9]{2})/);
    return {
        ref: match[1],
        date: match[2]
    };
}

function normalizeLeg(l) {
    var leg = {
        type: l.type,
        local: l.local,
        origin: normalizePlace(l.Origin),
        dest: normalizePlace(l.Destination),
        reference: l.JourneyDetailRef && extractReference(l.JourneyDetailRef.ref),
    };

    var startDateTime = leg.origin.date + ' ' + leg.origin.time;
    var endDateTime = leg.dest.date + ' ' + leg.dest.time;
    leg.duration = getDuration(startDateTime, endDateTime);

    return leg;
}

function normalize(list) {
    var r = [];

    if (!angular.isArray(list)) {
        list = [list];
    }

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
        journey.id = journey.startDate + journey.startTime + journey.endDate + journey.endTime;

        var startDateTime = journey.startDate + ' ' + journey.startTime;
        var endDateTime = journey.endDate + ' ' + journey.endTime;

        journey.duration = getDuration(startDateTime, endDateTime);
        r.push(journey);
    });
    return r;
}

/**
 * @ngInject
 */
servicesModule
    .factory('Trip', function (ReiseInfo, $q) {
        return {
            get: function (originId, destId, options) {
                var _options = angular.extend({}, {
                    originId: originId,
                    destId: destId,
                }, options);

                return ReiseInfo.trip(_options)
                    .then(function (data) {
                        var errorCode = data.TripList.errorCode;
                        if (errorCode) {
                            var errorText = data.TripList.errorText;
                            return $q.reject({
                                code: errorCode,
                                text: errorText
                            });
                        }
                        return normalize(data.TripList.Trip);
                    });
            }
        };
    });