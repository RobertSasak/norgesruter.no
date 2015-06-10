'use strict';

var directivesModule = require('../_index.js');
var angular = require('angular');
/**
 * @ngInject
 */
directivesModule.directive('inputStop', function () {
	return {
		restrict: 'E',
		templateUrl: 'inputStop/inputStop.html',
		controller: function ($window) {
			var vm = this;
			var Bloodhound = $window.Bloodhound;

			// Instantiate the bloodhound suggestion engine
			var numbers = new Bloodhound({
				datumTokenizer: function (d) {
					return Bloodhound.tokenizers.whitespace(d.num);
				},
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				local: [{
					num: 'one'
				}, {
					num: 'two'
				}, {
					num: 'three'
				}, {
					num: 'four'
				}, {
					num: 'five'
				}, {
					num: 'six'
				}, {
					num: 'seven'
				}, {
					num: 'eight'
				}, {
					num: 'nine'
				}, {
					num: 'ten'
				}]
			});

			// initialize the bloodhound suggestion engine
			numbers.initialize();

			// Typeahead options object
			vm.options = {
				highlight: true,
				editable: false
			};



			var remote = new Bloodhound({
				datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				identify: function (obj) {
					return obj.id;
				},
				remote: {
					url: 'http://crossorigin.me/http://hafas.utvikling01.reiseinfo.no/bin/dev/nri/rest.exe/v1.1/vs_restapi/location?authKey=api-test&format=json&input=%QUERY',
					wildcard: '%QUERY',
					transform: function (response) {
						if (angular.isArray(response.LocationList.StopLocation)) {
							return response.LocationList.StopLocation;
						}
						return [response.LocationList.StopLocation];
					}
				}
			});


			var local = new Bloodhound({
				datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				identify: function (obj) {
					return obj.id;
				},
				prefetch: {
					url: '/data/allStops.json',
				}
			});

			vm.datasets = [{
				displayKey: 'num',
				source: numbers.ttAdapter(),
				templates: {
					header: 'Numbers'
				}
			}, {
				displayKey: 'name',
				templates: {
					header: 'Local',
				},
				source: local
			}, {
				displayKey: 'name',
				templates: {
					header: 'Remote',
				},
				source: remote
			}];
		},
		controllerAs: 'ctrl',
		bindToController: {},
		scope: {},
	};
});