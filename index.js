var _ = require('underscore') 
_.str = require('underscore.string');
_.mixin(_.str.exports());

module.exports = exports = function superGoosePlugin(schema, options) {
  var messages = options.messages
  schema.statics.findOrCreate = function findOrCreate(object, callback) {
    var self = this;
    this.findOne(object, function(err, result) {
      if(err || result) {
        callback(err, result)
      } else {
        var obj = new self(object)
        obj.save(function(err) {
          callback(err, obj)
        });
      }
    })
  }

  schema.statics.errors = function errors(errors, callback) {
    errors = _.toArray(errors.errors)
    errors = _.map(errors, function(error) {
       return _.sprintf(messages[error.type], error.path) 
    })
    callback(errors)
  }
}