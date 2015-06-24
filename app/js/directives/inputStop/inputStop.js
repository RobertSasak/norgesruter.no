'use strict';

var directivesModule = require('../_index.js');
var angular = require('angular');
/**
 * @ngInject
 */
directivesModule.directive('inputStop', function (ReiseInfo, $interpolate, $templateCache, LastVisited, geolocation) {
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
				return array.slice(0, 30000).map(function (a) {
					return {
						id: a.id,
						name: a.name
					};
				});
			}

			function unwrap(response) {
				var sl = response.LocationList.StopLocation;
				if (!sl) {
					return [];
				}
				if (angular.isArray(sl)) {
					return sl;
				}
				return [sl];
			}

			function normalizeId(array) {
				angular.forEach(array, function (el) {
					el.id = parseInt(el.id, 10);
				});
				return array;
			}

			function addSource(array, source) {
				angular.forEach(array, function (el) {
					el.source = source;
				});
				return array;
			}

			var remote = new Bloodhound({
				datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				identify: function (obj) {
					return obj.id;
				},
				local: LastVisited.getAll(),
				remote: {
					url: baseUrl + 'location.name?authKey=' + authKey + '&format=json&input=%QUERY',
					wildcard: '%QUERY',
					transform: function (response) {
						return addSource(normalizeId(unwrap(response)), 'remote');
					}
				},
				prefetch: {
					url: '/data/allStops.json',
					transform: function (response) {
						return addSource(transformMinify(response), 'local');
					},
					ttl: 14 * 24 * 60 * 60 * 1000
				}
			});

			remote.initialize();

			function nearBy(q, sync, async) {
				if (q === '') {
					geolocation.getLocation({
						timeout: 60000
					}).then(function (position) {
						ReiseInfo.locationNearByStops({
							originCoordLat: position.coords.latitude,
							originCoordLong: position.coords.longitude,
							maxNo: 1000
						}).then(function (response) {
							return response.LocationList.StopLocation;
						}).then(function (data) {
							async(data);
						});
					});
				} else {
					sync([]);
				}
			}

			var suggestionTemplate = $templateCache.get('suggestion.tmpl.html');

			vm.datasets = [{
				displayKey: 'name',
				limit: 50,
				templates: {
					suggestion: function (params) {
						params.source = 'nearBy';
						return $interpolate(suggestionTemplate)(params);
					}
				},
				source: nearBy
			}, {
				displayKey: 'name',
				templates: {
					suggestion: function (params) {
						return $interpolate(suggestionTemplate)(params);
					}
				},
				source: remote
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