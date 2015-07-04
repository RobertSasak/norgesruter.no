'use strict';

var controllersModule = require('./_index');
var moment = require('moment');

/**
 * @ngInject
 */
controllersModule.controller('Trip', function ($state, $stateParams, $scope, Focus, Blur, hotkeys, LastVisited, $filter) {
	var vm = this;

	vm.showDest = true;
	vm.showDate = true;
	vm.showResults = true;
	vm.options = {};
	vm.datetime = new Date();

	(function () {
		var filterDate = $filter('date');

		$scope.$watch(function () {
			return vm.datetime;
		}, function (value) {
			if (value) {
				vm.options.date = filterDate(value, 'yyyy-MM-dd');
				vm.options.time = filterDate(value, 'HH:mm');
			}
		});
	})();

	vm.datetime.setMinutes(0);
	vm.datetime.setSeconds(0);
	vm.datetime.setMilliseconds(0);

	$scope.$on('originInput:open', function () {
		$scope.$apply(function () {
			vm.showDest = false;
			vm.showDate = false;
			vm.showResults = false;
		});
	});

	$scope.$on('originInput:close', function () {
		$scope.$apply(function () {
			vm.showDest = true;
			vm.showDate = true;
			vm.showResults = true;
		});
	});

	$scope.$on('destInput:open', function () {
		$scope.$apply(function () {
			vm.showResults = false;
			vm.showDate = false;
		});
	});

	$scope.$on('destInput:close', function () {
		$scope.$apply(function () {
			vm.showResults = true;
			vm.showDate = true;
		});
	});

	$scope.$on('destInput:close', function () {
		Blur('destInput');
	});

	function moveToDest() {
		if (!vm.dest) {
			Focus('destInput');
		} else {
			Blur('originInput');
		}
	}

	$scope.$on('originInput:selected', moveToDest);
	$scope.$on('originInput:autocompleted', moveToDest);

	if (!$stateParams.originId && !$stateParams.destId) {
		Focus('originInput');
	}

	// lastVisited
	(function () {
		function addToLastVisited(event, obj) {
			LastVisited.set(obj);
		}
		$scope.$on('originInput:selected', addToLastVisited);
		$scope.$on('originInput:autocompleted', addToLastVisited);
		$scope.$on('destInput:selected', addToLastVisited);
		$scope.$on('destInput:autocompleted', addToLastVisited);

	})();

	// typeahead
	(function () {
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
	})();

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

		if ($stateParams.time) {
			var a = moment($stateParams.time, 'HH:mm');
			vm.datetime = moment(vm.datetime)
				.hour(a.hour())
				.minute(0)
				.toDate();
		}

		if ($stateParams.date) {
			var b = moment($stateParams.date, 'YYYY-MM-DD');
			vm.datetime = moment(vm.datetime)
				.year(b.year())
				.month(b.month())
				.date(b.date())
				.toDate();
		}
	})();

	// update url for every change
	(function () {
		var transitionOptions = {
			location: 'replace',
			inherit: true,
			notify: false
		};

		$scope.$watch(function () {
			return vm.origin;
		}, function (value) {
			if (value) {
				$state.transitionTo('trip', {
					originId: value.id,
					originName: value.name
				}, transitionOptions);
			}
		});

		$scope.$watch(function () {
			return vm.dest;
		}, function (value) {
			if (value) {
				$state.transitionTo('trip', {
					destId: value.id,
					destName: value.name
				}, transitionOptions);
			}
		});

		$scope.$watch(function () {
			return vm.options.date + vm.options.time;
		}, function (value) {
			if (value) {
				if (moment(vm.datetime).isSame(moment(), 'day')) { // today
					$state.transitionTo('trip', {
						date: '',
						time: vm.options.time
					}, transitionOptions);
				} else {
					$state.transitionTo('trip', {
						date: vm.options.date,
						time: vm.options.time
					}, transitionOptions);
				}
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