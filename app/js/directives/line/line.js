'use strict';

var directivesModule = require('../_index.js');

/**
 * @ngInject
 */
directivesModule.directive('line', function () {
	return {
		restrict: 'E',
		templateUrl: 'line/line.html',
		controller: function () {},
		controllerAs: 'ctrl',
		bindToController: {
			type: '=',
			number: '=',
		},
		scope: {},
	};
});