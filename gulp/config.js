'use strict';

module.exports = {

    'browserport': 3000,
    'uiport': 3001,
    'serverport': 3002,

    'styles': {
        'src': [
            'app/styles/**/*.scss',
            'app/js/directives/**/*.scss',
            'app/js/directives/**/*.css',
        ],
        'dest': 'build/css'
    },

    'scripts': {
        'src': 'app/js/**/*.js',
        'dest': 'build/js'
    },

    'images': {
        'src': 'app/images/**/*',
        'dest': 'build/images'
    },

    'fonts': {
        'src': [
            'node_modules/font-awesome*/css/font-awesome.min.css',
            'node_modules/font-awesome*/fonts/*'
        ],
        'dest': 'build/fonts'
    },

    'views': {
        'watch': [
            'app/index.html',
            'app/js/directives/**/*.html',
            'app/views/**/*.html'
        ],
        'src': [
            'app/js/directives/**/*.html',
            'app/views/**/*.html'
        ],
        'dest': 'app/js'
    },

    'gzip': {
        'src': 'build/**/*.{html,xml,json,css,js,js.map}',
        'dest': 'build/',
        'options': {}
    },

    'dist': {
        'root': 'build'
    },

    'browserify': {
        'entries': ['./app/js/main.js'],
        'bundleName': 'main.js',
        'sourcemap': true
    },

    'test': {
        'karma': 'test/karma.conf.js',
        'protractor': 'test/protractor.conf.js'
    },

    deploy: {
        cname: 'www.norgesruter.no'
    }

};