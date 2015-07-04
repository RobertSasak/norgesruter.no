'use strict';

var servicesModule = require('./_index.js');

/**
 * @ngInject
 */
servicesModule
	.factory('Blur', function ($timeout, $window) {
		return function (id) {
			$timeout(function () {
				var element = $window.document.getElementById(id);
				if (element) {
					document.activeElement.blur();
					element.blur();
				}
			});
		};
	});