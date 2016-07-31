var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var async = require('async');
var recReadDir = require('recursive-readdir');

/**
 * Bermooda Bundler
 */
module.exports = {

    _outputFile: '.bermooda.config.json',
    _configName: 'bermooda.json',
    _dirCore: 'app/core/modules',
    _dirExt: 'bermooda_modules',

    _parseData: function(str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return false;
        }
    },

    _handleError: function(file) {
        var msg = '>> Error: Invalid JSON -> ' + file;
        this._errors.push(msg);
        console.log(chalk.red(msg));
    },

    _readDirectories: function(dirs, configName, callback) {
        recReadDir('.', ['!{' + dirs.join() + '}/**/' + configName], callback);
    },

    _readAsync: function(file, callback) {
        var self = this;

        fs.readFile(file, 'utf8', function(err, data) {
            var parsedData = self._parseData(data);
            if (parsedData) {
                parsedData._modulePath = file.replace(self._configName, '');
            } else {
                self._handleError(file);
            }

            callback.call(null, err, parsedData);
        });
    },

    _buildConfig: function(dirConfig) {
        var self = this;
        var config = { core: {}, extensions: {} };

        _.each(dirConfig, function(conf) {
            if (conf._modulePath.indexOf(self._dirCore) > -1) {
                config.core[conf.name] = conf;
            } else {
                config.extensions[conf.name] = conf;
            }
        });

        return config;
    },

    _writeFile: function(data, fileName) {
        var baseDir = process.cwd();
        var file = path.join(baseDir, fileName);

        fs.writeFile(file, JSON.stringify(data, null, 2), function(err) {
            console.log((err) ? chalk.red(err) : chalk.green('Bundle complete'));
        });
    },

    bundle: function() {
        var self = this;
        var dirs = [this._dirCore, this._dirExt];
        var readAsyc = this._readAsync.bind(this);

        // Clear bundle errors
        this._errors = [];

        console.log(chalk.underline('\r\nRunning bermooda bundler'));

        this._readDirectories(dirs, this._configName, function(err, files) {
            async.map(files, readAsyc, function(err, results) {
                var config = _.isEmpty(self._errors) ? self._buildConfig(results) : self._errors;
                self._writeFile(config, self._outputFile);
            });
        });
    }

};
