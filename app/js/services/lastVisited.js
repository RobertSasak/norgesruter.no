'use strict';

var servicesModule = require('./_index.js');

/**
 * @ngInject
 */
servicesModule
    .factory('LastVisited', function ($localStorage) {
        var storage = $localStorage.$default({
            lastVisited: {}
        });

        var lastVisited = storage.lastVisited;

        function obj2Array(obj) {
            return Object.keys(obj).map(function (key) {
                return obj[key];
            });
        }

        return {
            get: function (id) {
                return lastVisited[id];
            },
            set: function (obj) {
                var old = lastVisited[obj.id];
                obj.count = old ? old.count + 1 : 0;
                obj.source = 'lastVisited';
                lastVisited[obj.id] = obj;
            },
            getAll: function () {
                return obj2Array(lastVisited);
            }
        };

    });