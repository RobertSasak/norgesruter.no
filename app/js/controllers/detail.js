'use strict';

var controllersModule = require('./_index');

/**
 * @ngInject
 */
controllersModule.controller('Detail', function ($stateParams) {
	var vm = this;

	vm.reference = $stateParams.reference.replace(/\-/g, '/') + '?' + 'date=' + $stateParams.date;
});