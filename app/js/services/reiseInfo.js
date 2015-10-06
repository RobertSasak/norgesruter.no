'use strict';

var servicesModule = require('./_index.js');
var angular = require('angular');

/**
 * @ngInject
 */
function ReiseInfo($q, $http, CacheFactory, AppSettings) {

    var service = {};
    var baseUrl = AppSettings.reiseinfoApi;
    var defaultParams = {
        authKey: AppSettings.authKey,
        format: 'json'
    };

    function getEndPoint(endPoint, cache) {
        return function (params) {
            return $http({
                    url: baseUrl + endPoint,
                    params: angular.extend([], defaultParams, params),
                    cache: cache
                })
                .then(function (data) {
                    return data.data;
                });
        };
    }

    function createCache(name, recycleFreq) {
        if (!CacheFactory.get(name)) {
            return CacheFactory.createCache(name, {
                storageMode: 'localStorage',
                deleteOnExpire: 'aggressive',
                recycleFreq: recycleFreq
            });
        }
    }

    var tripCache = createCache('trip', 1 * 60 * 60 * 1000);

    service.locationName = getEndPoint('location.name');
    service.locationAllStops = getEndPoint('location.allstops');
    service.locationNearByStops = getEndPoint('location.nearbystops');

    service.trip = getEndPoint('trip', tripCache);
    service.departureBoard = getEndPoint('departureBoard');
    service.arrivalBoard = getEndPoint('arrivalBoard');

    service.journeyDetail = getEndPoint('journeyDetail');
    service.geometry = getEndPoint('Geometry');

    return service;

}

servicesModule.service('ReiseInfo', ReiseInfo);