module.exports = exports = function superGoosePlugin(schema) {
  schema.statics.findOrCreate = function findOrCreate(object, callback) {
    var self = this;
    this.findOne(object, function(err, result) {
      if(err || result)
        callback(err, result)
      else
        self.create(object, callback)
    })
  }
}

