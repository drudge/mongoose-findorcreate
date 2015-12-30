/*!
 * Mongoose findOrCreate Plugin
 * Copyright(c) 2012 Nicholas Penree <nick@penree.com>
 * MIT Licensed
 */

"use strict";

var findOrCreatePlugin = function(schema, options) {
  schema.statics.findOrCreate = function findOrCreate(conditions, doc, options, callback) {
    
    //Check if any of the paramaters are callbacks or not.
    var hasCallback = false;
    for(var i = 0; i < arguments.length; i++){
      if(typeof arguments[i] === 'function'){
        hasCallback = true;
      }
    }

    if (arguments.length > 1 && hasCallback) {
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
      doFindOrCreate.call(this, conditions, doc, options, callback);
    } else {
      //Check that we can support promises
      if(typeof Promise !== "undefined" && Promise.toString().indexOf("[native code]") !== -1){
        var that = this;
        return new Promise(function(resolve, reject){

          var callback = function(err, object){
            if(err){
              reject(err);
            } else {
              resolve(object);
            }
          }
          
          doFindOrCreate.call(that, conditions, doc, options, callback);
        });
      } else {
        console.log(Error("Promises not currently supported"));
      }
    }
  }
}


var doFindOrCreate = function(conditions, doc, options, callback){
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
      var obj = new self(conditions)
      obj.save(function(err) {
        callback(err, obj, true);
      });
    }
  });
};

/**
 * Expose `findOrCreatePlugin`.
 */

module.exports = findOrCreatePlugin;