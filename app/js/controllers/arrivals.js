'use strict';

var controllersModule = require('./_index');

/**
 * @ngInject
 */
controllersModule.controller('Arrivals', function ($stateParams) {
	var vm = this;

	vm.id = $stateParams.id;
});