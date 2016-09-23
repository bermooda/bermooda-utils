var _ = require('underscore');

/**
 * Bermooda Utility
 */
module.exports = {

    concat: function() {
        var args = (arguments.length === 1) ? [arguments[0]] : Array.apply(null, arguments);
        return args.join(' ');
    }

};

/**
 * Bermooda localStorage utility
 */
module.exports.storage = {

    /**
     * Set and stringify local storage item(s)
     *
     * @param {(string|object)} key
     * @param {*} value
     */
    set: function(key, value) {
        if (_.isObject(key)) {
            for (var prop in key) {
                localStorage.setItem(prop, JSON.stringify(key[prop]));
            }
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    },

    /**
     * Get and parse local storage item
     *
     * @param 	{string} key
     * @returns {*}
     */
    get: function(key) {
        return JSON.parse(localStorage.getItem(key));
    },

    /**
     * Remove local storage item(s)
     *
     * @param {(string|Array)} key
     */
    remove: function(key) {
        if (_.isArray(key)) {
            for (var i = 0, len = key.length; i < len; i++) {
                localStorage.removeItem(key[i]);
            }
        } else {
            localStorage.removeItem(key);
        }
    },

    /**
     * Clear local storage
     */
    clear: function() {
        localStorage.clear();
    }

};

/**
 * Bermooda localization utility
 */
module.exports.localization = {

    data: {},

    __: function() {
        var args = (arguments.length === 1) ? arguments[0] : arguments;

        if (_.isObject(args[1])) {
            return this.template(args[0], args[1]);
        } else if (arguments.length > 1) {
            return this.sprintf.apply(this, args);
        } else {
            return this.translate(args);
        }
    },

    set: function(data) {
        this.data = data;
    },

    add: function(key, value) {
        if (_.isObject(key)) {
            for (var prop in key) {
                this.data[prop] = key[prop];
            }
        } else {
            this.data[key] = value;
        }
    },

    remove: function(key) {
        delete this.data[key];
    },

    sprintf: function() {
        var args = Array.prototype.slice.call(arguments);
        var translation = this.translate(args.shift());

        return translation.replace(/%s/g, function() {
            return args.shift();
        });
    },

    template: function(key, value) {
        var translation = this.translate(key);

        for (var p in value) {
            translation = translation.replace(
                new RegExp('{' + p + '}', 'g'),
                value[p]
            );
        }

        return translation;
    },

    translate: function(key) {
        if (this.data[key]) {
            return this.data[key];
        } else {
            console.warn('No translation found for key "' + key + '"');
            return '';
        }
    }

};
