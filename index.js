/*!
 * Mongoose findOrCreate Plugin
 * Copyright(c) 2012 Nicholas Penree <nick@penree.com>
 * MIT Licensed
 */

function findOrCreatePlugin(schema, options) {
  schema.statics.findOrCreate = function findOrCreate(conditions, doc, options, callback) {
    var self = this;
    
    var Promise = global.Promise.ES6 ? global.Promise.ES6 : global.Promise;
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
      } else {
        // Scenario: findOrCreate(conditions[, doc[, options]])
        return new Promise(function(resolve, reject) {
          self.findOrCreate(conditions, doc, options, function (ex, result, created) {
            if (ex) {
              reject(ex);
            } else {
              resolve({
                doc: result,
                created: created,
              });
            }
          });
        });
      }
    }
    //mongoose 7.0.x does not support callbacks so we use findOne().exec().then().catch()
    this.findOne(conditions).exec().then(function(result){
      if(result == null){
        for(var key in doc){
          conditions[key] = doc[key];
        }
        var keys = Object.keys(conditions);
        for(var z = 0;z < keys.length; z++){
          var value = JSON.stringify(conditions[keys[z]]);
          if(value && value.indexOf('$') !== -1){
            delete conditions[keys[z]];
          }
        }
        var obj = new self(conditions);
        obj.save().then(function(result){
          err = null;
          callback(err,obj,true);
        }).catch(function(err){
          console.log(err);
        });

      }
      else{
        if(options && options.upsert){
          self.update(conditions,doc).exec().then(function(count){
            self.findById(result._id).exec().then(function(result){

              err = null;
              callback(err,result,false);
            }).catch(function(err){
              result = null;
              callback(err,result,false);
            });
          }).catch(function(err){
              result = null;
              callback(err,result,false);
          });
        }
        else{
          err = null;
          callback(err,result,false);
        }
      }


    }).catch(function(err){
        console.log(err);
    });
  };
}

/**
 * Expose `findOrCreatePlugin`.
 */

module.exports = findOrCreatePlugin;
