'use strict';

var controllersModule = require('./_index');
var moment = require('moment');

/**
 * @ngInject
 */
controllersModule.controller('Time', function ($stateParams, $state) {
	var vm = this;

	vm.searchForDeparture = true;
	vm.time = moment().milliseconds(0).toDate();
	vm.date = moment().milliseconds(0).toDate();

	vm.back = function () {
		$state.go('planner.to', {
			originId: $stateParams.originId,
			destId: $stateParams.originId
		});
	};

	vm.now = function () {
		$state.go('results', {
			originId: $stateParams.originId,
			destId: $stateParams.destId,
		});
	};

	vm.search = function () {
		$state.go('results', {
			originId: $stateParams.originId,
			destId: $stateParams.destId,
			time: vm.time,
			date: vm.date
		});
	};
});