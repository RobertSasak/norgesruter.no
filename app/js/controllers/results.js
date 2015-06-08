'use strict';

var controllersModule = require('./_index');

/**
 * @ngInject
 */
controllersModule.controller('Results', function ($stateParams, $state) {
	var vm = this;

	vm.originId = $stateParams.originId;
	vm.destId = $stateParams.destId;
	vm.date = $stateParams.date;
	vm.time = $stateParams.time;

	vm.back = function () {
		$state.go('planner.time', {
			originId: vm.originId,
			destId: vm.destId,
			date: vm.date,
			time: vm.time
		});
	};
});