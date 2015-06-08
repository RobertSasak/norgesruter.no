'use strict';

var controllersModule = require('./_index');

/**
 * @ngInject
 */
controllersModule.controller('Departures', function ($stateParams) {
	var vm = this;

	vm.id = $stateParams.id;
});