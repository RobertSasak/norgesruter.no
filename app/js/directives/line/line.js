'use strict';

var directivesModule = require('../_index.js');
var angular = require('angular');

/**
 * @ngInject
 */
directivesModule.directive('line', function () {
	return {
		restrict: 'E',
		templateUrl: 'line/line.html',
		controller: function () {
			var vm = this;
		},
		controllerAs: 'ctrl',
		bindToController: {
			type: '=',
			number: '=',
		},
		scope: {},
	};
});