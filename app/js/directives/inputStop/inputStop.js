'use strict';

var directivesModule = require('../_index.js');
var angular = require('angular');
var typehead = require('typeahead.js');
var Bloodhound = require('../../../../node_modules/typeahead.js/dist/bloodhound.js');

/**
 * @ngInject
 */
directivesModule.directive('inputStop', function (ReiseInfo, $interpolate, $templateCache, LastVisited, geolocation, AppSettings, Focus) {
	return {
		restrict: 'E',
		templateUrl: 'inputStop/inputStop.html',
		controller: function () {
			var vm = this;
			var authKey = 'api-test';
			var baseUrl = AppSettings.reiseinfoApi;
			var limitHistory = 4;


			vm.clear = function () {
				Focus(vm.id + 'Input');
				vm.model = null;
			};

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
				},
				local: LastVisited.getAll(),

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
					sync(LastVisited.getLast(limitHistory));
				} else {
					sync([]);
				}
			}

			var suggestionTemplate = $templateCache.get('suggestion.tmpl.html');

			vm.datasets = [{
				source: nearBy,
				displayKey: 'name',
				limit: 150,
				templates: {
					suggestion: function (params) {
						if (!params.source) {
							params.source = 'nearBy';
						}
						return $interpolate(suggestionTemplate)(params);
					}
				},
			}, {
				source: remote,
				displayKey: 'name',
				limit: 30,
				templates: {
					suggestion: function (params) {
						return $interpolate(suggestionTemplate)(params);
					}
				},
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