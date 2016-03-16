/*!
 * Mongoose findOrCreate Plugin
 * Copyright(c) 2012 Nicholas Penree <nick@penree.com>
 * MIT Licensed
 */

function findOrCreatePlugin(schema, options) {
  schema.statics.findOrCreate = function findOrCreate(conditions, doc, options, callback) {
    if (arguments.length < 4) {
      if (typeof options === 'function') {
        // Scenario: findOrCreate(conditions, doc, callback)
        callback = options;
        options = {};
      } else if (typeof doc === 'function') {
        // Scenario: findOrCreate(conditions, callback);
        callback = doc;
        doc = {};
        options = {};
      }
    }
    var self = this;
    this.findOne(conditions, function(err, result) {
      if(err || result) {
        if(options && options.upsert && !err) {
          self.update(conditions, doc, function(err, count){
            self.findOne(conditions, function(err, result) {
              callback(err, result, false);
            });
          })
        } else {
          callback(err, result, false)
        }
      } else {
        for (var key in doc) {
         conditions[key] = doc[key];
        }
        // If the value contain `$` remove the key value pair
        var keys = Object.keys(conditions);

        keys.forEach(function (key) {
          if (JSON.stringify(conditions[key]).indexOf('$') !== -1) {
            delete conditions[key];
          }
        });

        var obj = new self(conditions)
        obj.save(function(err) {
          callback(err, obj, true);
        });
      }
    })
  }
}

/**
 * Expose `findOrCreatePlugin`.
 */

module.exports = findOrCreatePlugin;
