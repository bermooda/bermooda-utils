var _ = require('underscore');
var dotProp = require('dot-prop');

/**
 * Bermooda Config Store
 * @param {Object} config Configuration
 * @constructor
 */
function ConfigStore(config) {
    this._data = config;
}

/**
 * Basic Methods
 */

ConfigStore.prototype.get = function(key) {
    return dotProp.get(this._data, key);
};

ConfigStore.prototype.set = function(key, val) {
    var config = this._data;

    if (arguments.length === 1) {
        Object.keys(key).forEach(function(k) {
            dotProp.set(config, k, key[k]);
        });
    } else {
        dotProp.set(config, key, val);
    }

    this._data = config;
};

ConfigStore.prototype.has = function(key) {
    return dotProp.has(this._data, key);
};

ConfigStore.prototype.delete = function(key) {
    dotProp.delete(this._data, key);
};

ConfigStore.prototype.clear = function() {
    this._data = {};
};

/**
 * Extended Methods
 */

ConfigStore.prototype.getNavigationItems = function() {

};

ConfigStore.prototype.hasAccess = function(user) {

};

module.exports = ConfigStore;
