'use strict';

var controllersModule = require('./_index');

/**
 * @ngInject
 */
controllersModule.controller('To', function ($state, $stateParams) {
	var vm = this;

	vm.back = function () {
		$state.go('planner.from', {
			originId: $stateParams.originId
		});
	};

	vm.select = function (selected) {
		vm.nextStep(selected.originalObject.id);
	};

	vm.nextStep = function (id) {
		$state.go('planner.time', {
			originId: $stateParams.originId,
			destId: id
		});
	};
});