'use strict';

var servicesModule = require('./_index.js');
var angular = require('angular');

/**
 * @ngInject
 */
function ReiseInfo($q, $http, CacheFactory) {

    var service = {};
    //var baseUrl = 'http://crossorigin.me/http://hafas.utvikling01.reiseinfo.no/bin/dev/nri/rest.exe/v1.1/vs_restapi/';
    var baseUrl = 'http://crossorigin.me/http://hafas.websrv05.reiseinfo.no/bin/dev/nri/rest.exe/v1.1/vs_restapi/';
    var defaultParams = {
        authKey: 'api-test',
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

    if (!CacheFactory.get('allstops')) {
        CacheFactory.createCache('allstops', {
            storageMode: 'localStorage',
            deleteOnExpire: 'aggressive',
            recycleFreq: 7 * 24 * 60 * 60 * 1000
        });
    }

    var allstopsCache = CacheFactory.get('allstops');


    service.locationName = getEndPoint('location.name');
    service.locationAllStops = getEndPoint('location.allstops', allstopsCache);
    service.locationNearByStops = getEndPoint('location.nearbystops');

    service.trip = getEndPoint('trip');
    service.departureBoard = getEndPoint('departureBoard');
    service.arrivalBoard = getEndPoint('arrivalBoard');

    service.journeyDetail = getEndPoint('journeyDetail');
    service.geometry = getEndPoint('Geometry');

    return service;

}

servicesModule.service('ReiseInfo', ReiseInfo);