'use strict';

var servicesModule = require('./_index.js');

/**
 * @ngInject
 */
servicesModule
    .factory('Focus', function ($timeout, $window) {
        return function (id) {
            $timeout(function () {
                var element = $window.document.getElementById(id);
                if (element) {
                    element.focus();
                }
            });
        };
    });