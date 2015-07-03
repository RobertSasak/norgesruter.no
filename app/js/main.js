'use strict';

var angular = require('angular');

// angular modules
require('angular-ui-router');
require('./templates');
require('./controllers/_index');
require('./services/_index');
require('./directives/_index');
require('angucomplete-alt');
require('angular-hotkeys');
require('ngstorage');
require('angular-cache');
require('angular-datepicker');

// create and bootstrap application
angular.element(document).ready(function () {

    var requires = [
        'ui.router',
        'templates',
        'app.controllers',
        'app.services',
        'app.directives',
        'angucomplete-alt',
        'cfp.hotkeys',
        'ngStorage',
        'angular-cache',
        'datePicker',
        require('angular-i18n/nb-no')
    ];

    // mount on window for testing
    window.app = angular.module('app', requires);

    angular.module('app').constant('AppSettings', require('./constants'));

    angular.module('app').config(require('./on_config'));

    angular.module('app').run(require('./on_run'));

    angular.module('app').config(function (hotkeysProvider) {
        hotkeysProvider.includeCheatSheet = true;
    });

    angular.bootstrap(document, ['app']);

});