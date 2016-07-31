var _ = require('underscore');
var chalk = require('chalk');
var chokidar = require('chokidar');
var bundler = require('./bundler');

// Add debounce to handle multiple file changes at the same time
var runBundler = _.debounce(function() {
    bundler.bundle();
}, 50);

/**
 * Bermooda Config Watcher
 */
module.exports = {

    _pattern: 'app/core/**/bermooda.json',

    _registerEvents: function() {
        this._watcher
            .on('add', this._onEvent)
            .on('change', this._onEvent)
            .on('unlink', this._onEvent);
    },

    _onEvent: function(path) {
        console.log(chalk.dim('>>'), 'File', path, 'changed');
        runBundler();
    },

    watch: function() {
        console.log(chalk.underline('\r\nStart watching bermooda config'));
        this._watcher = chokidar.watch(this._pattern, { ignoreInitial: true });
        this._registerEvents();
    },

    getWatcher: function() {
        return this._watcher;
    }

};
