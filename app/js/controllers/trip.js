'use strict';

var controllersModule = require('./_index');

/**
 * @ngInject
 */
controllersModule.controller('Trip', function ($state, $stateParams, $scope, Focus, hotkeys) {
	var vm = this;

	vm.showDest = true;
	vm.showResults = true;

	$scope.$on('originInput:open', function () {
		$scope.$apply(function () {
			vm.showDest = false;
			vm.showResults = false;
		});
	});

	$scope.$on('originInput:close', function () {
		$scope.$apply(function () {
			vm.showDest = true;
			vm.showResults = true;
		});
	});

	$scope.$on('destInput:open', function () {
		$scope.$apply(function () {
			vm.showResults = false;
		});
	});

	$scope.$on('destInput:close', function () {
		$scope.$apply(function () {
			vm.showResults = true;
		});
	});

	function moveToDest() {
		if (!vm.dest) {
			Focus('destInput');
		}
	}

	$scope.$on('originInput:selected', moveToDest);
	$scope.$on('originInput:autocompleted', moveToDest);

	if (!$stateParams.originId && !$stateParams.destId) {
		Focus('originInput');
	}

	// typeahead
	$scope.$on('typeahead:open', function (event) {
		$scope.$emit(event.targetScope.options.id + 'Input:open');
	});

	$scope.$on('typeahead:close', function (event) {
		$scope.$emit(event.targetScope.options.id + 'Input:close');
	});

	$scope.$on('typeahead:selected', function (event, selected) {
		$scope.$emit(event.targetScope.options.id + 'Input:selected', selected);
	});

	$scope.$on('typeahead:autocompleted', function (event, selected) {
		$scope.$emit(event.targetScope.options.id + 'Input:autocompleted', selected);
	});

	// set params from url
	(function () {
		if ($stateParams.originId) {
			vm.origin = {
				id: $stateParams.originId,
				name: $stateParams.originName
			};
		}

		if ($stateParams.destId) {
			vm.dest = {
				id: $stateParams.destId,
				name: $stateParams.destName
			};
		}
	})();

	// update url for every change
	(function () {
		$scope.$watch(function () {
			return vm.origin;
		}, function (value) {
			if (value) {
				$state.transitionTo('trip', {
					originId: value.id,
					originName: value.name
				}, {
					location: 'replace', //  update url and replace
					inherit: true,
					notify: false
				});
			}
		});

		$scope.$watch(function () {
			return vm.dest;
		}, function (value) {
			if (value) {
				$state.transitionTo('trip', {
					destId: value.id,
					destName: value.name
				}, {
					location: 'replace', //  update url and replace
					inherit: true,
					notify: false
				});
			}
		});
	})();

	// key bindings
	(function () {
		hotkeys.bindTo($scope)
			.add({
				combo: '/',
				description: 'Search',
				callback: function () {
					Focus('originInput');
				}
			});
	})();

});