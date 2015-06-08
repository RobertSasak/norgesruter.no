'use strict';

var controllersModule = require('./_index');

/**
 * @ngInject
 */
controllersModule.controller('Trip', function ($state) {
	var vm = this;

	vm.onFormSubmit = function () {
		$state.go('Results', {
			originId: vm.origin.originalObject.id,
			destId: vm.dest.originalObject.id,
			time: vm.time,
			date: vm.date
		});
	};
});