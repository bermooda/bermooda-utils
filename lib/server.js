/**
 * Bermooda Server Utility
 */
module.exports = {

    filterProperties: function(properties) {
        // Disallow id override
        delete properties.id;

        var props = {};
        for (var property in properties) {
            if (properties.hasOwnProperty(property) && property.indexOf('_') !== 0) {
                props[property] = properties[property];
            }
        }

        return props;
    },

    setNewProperties: function(item, properties) {
        properties = this.filterProperties(properties);

        for (var property in properties) {
            if (properties.hasOwnProperty(property)) {
                item[property] = properties[property];
            }
        }

        item.updated = new Date();
    }

};
