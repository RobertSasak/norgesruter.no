'use strict';

var controllersModule = require('./_index');

/**
 * @ngInject
 */
controllersModule.controller('From', function ($state) {
	var vm = this;

	vm.select = function (selected) {
		vm.nextStep(selected.originalObject.id);
	};

	vm.nextStep = function (id) {
		$state.go('planner.to', {
			originId: id,
		});
	};
});