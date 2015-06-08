'use strict';

var servicesModule = require('./_index.js');
var angular = require('angular');

/**
 * @ngInject
 */
function ReiseInfo($q, $http) {

    var service = {};
    var baseUrl = 'http://crossorigin.me/http://hafas.utvikling01.reiseinfo.no/bin/dev/nri/rest.exe/v1.1/vs_restapi/';
    var defaultParams = {
        authKey: 'api-test',
        format: 'json'
    };

    function getEndPoint(endPoint) {
        return function (params) {
            return $http({
                    url: baseUrl + endPoint,
                    params: angular.extend([], defaultParams, params)
                })
                .then(function (data) {
                    return data.data;
                });
        };
    }

    service.locationName = getEndPoint('location.name');
    service.locationAllStops = getEndPoint('location.allstops');
    service.locationNearByStops = getEndPoint('location.nearbystops');

    service.trip = getEndPoint('trip');
    service.departureBoard = getEndPoint('departureBoard');
    service.arrivalBoard = getEndPoint('arrivalBoard');

    service.journeyDetail = getEndPoint('journeyDetail');
    service.geometry = getEndPoint('Geometry');

    return service;

}

servicesModule.service('ReiseInfo', ReiseInfo);