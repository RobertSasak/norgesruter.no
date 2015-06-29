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

        function sortByTime(a, b) {
            if (a.touch < b.touch) {
                return 1;
            }
            if (a.touch > b.touch) {
                return -1;
            }
            return 0;
        }

        return {
            get: function (id) {
                return lastVisited[id];
            },
            set: function (obj) {
                var old = lastVisited[obj.id];
                obj.count = old ? old.count + 1 : 0;
                obj.touch = new Date();
                obj.source = 'lastVisited';
                lastVisited[obj.id] = obj;
            },
            getAll: function () {
                return obj2Array(lastVisited);
            },
            getLast: function (limit) {
                if (!limit) {
                    limit = 1000;
                }
                var arr = obj2Array(lastVisited).sort(sortByTime).slice(0, limit);
                return arr;
            }
        };

    });