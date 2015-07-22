'use strict';

/**
 * @ngInject
 */
function OnRun($rootScope, AppSettings) {

	$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
		$rootScope.pageTitle = '';
		console.log(toParams);
		if (toParams.originName) {
			$rootScope.pageTitle += toParams.originName;

			if (toParams.destName) {
				$rootScope.pageTitle += ' → ' + toParams.destName;
			}
		} else {
			$rootScope.pageTitle = AppSettings.appTitle;
		}
	});

}

module.exports = OnRun;