'use strict';

var directivesModule = require('../_index.js');
var angular = require('angular');
/**
 * @ngInject
 */
directivesModule.directive('inputStop', function (ReiseInfo) {
	return {
		restrict: 'E',
		templateUrl: 'inputStop/inputStop.html',
		controller: function ($window) {
			var vm = this;
			var Bloodhound = $window.Bloodhound;
			var authKey = 'api-test';
			var baseUrl = 'http://crossorigin.me/http://hafas.websrv05.reiseinfo.no/bin/dev/nri/rest.exe/v1.1/vs_restapi/';

			// Typeahead options object
			vm.options = {
				id: vm.id,
				highlight: true,
				editable: false,
				minLength: 0
			};

			// maximum 33000 for {id,name}
			// maximum 34000 for {i,n}
			function transformMinify(array) {
				return array.slice(0, 34000).map(function (a) {
					return {
						id: a.id,
						name: a.name
					};
				});
			}

			var remote = new Bloodhound({
				datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				identify: function (obj) {
					return obj.id;
				},
				remote: {
					url: baseUrl + 'location?authKey=' + authKey + '&format=json&input=%QUERY',
					wildcard: '%QUERY',
					transform: function (response) {
						if (!response.LocationList.StopLocation) {
							return [];
						}
						if (angular.isArray(response.LocationList.StopLocation)) {
							return transformMinify(response.LocationList.StopLocation);
						}
						return transformMinify([response.LocationList.StopLocation]);
					}
				},
				prefetch: {
					url: '/data/allStops.json',
					transform: transformMinify,
					ttl: 14 * 24 * 60 * 60 * 1000
				}
			});

			remote.initialize();

			function nearBy(q, sync, async) {
				if (q === '') {
					ReiseInfo.locationNearByStops({
						originCoordLat: 60.391263,
						originCoordLong: 5.322054
					}).then(function (response) {
						return response.LocationList.StopLocation;
					}).then(function (data) {
						async(data);
					});
					//TODO: remove
					//var a = local.get([6653]);
					//sync(a);
				} else {
					sync();
					async();
				}
			}

			vm.datasets = [{
				displayKey: 'name',
				//limit: 50,
				templates: {
					header: 'Local',
				},
				source: remote
			}, {
				displayKey: 'name',
				templates: {
					header: 'Near by',
					notFound: 'No stops near by',
					pending: 'Searching nearby stops...'
				},
				source: nearBy
			}];
		},
		controllerAs: 'ctrl',
		bindToController: {
			id: '@',
			model: '=',
			placeholder: '@',
			initialValue: '='
		},
		scope: {}
	};
});