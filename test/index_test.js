var mocha = require('mocha')
  , should = require('should')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , supergoose = require('../index.js')

mongoose.connect('mongodb://localhost:27017/supergoose')
mongoose.connection.on('error', function (err) {
  console.error('MongoDB error: ' + err.message);
  console.error('Make sure a mongoDB server is running and accessible by this application')
});

var ClickSchema = new Schema({
  ip : {type: String, required: true}
})

var messages =  {
  'required': "%s is required"
}

ClickSchema.plugin(supergoose, {messages: messages});
var Click = mongoose.model('Click', ClickSchema);

after(function(done) {
  mongoose.connection.db.dropDatabase()
  done();
})

describe('findOrCreate', function() {
  it("should create the obeject if it doesn't exist", function(done) {
    Click.findOrCreate({ip: '127.0.0.1'}, function(err, click) {
      click.ip.should.eql('127.0.0.1')
      Click.count({}, function(err, num) {
        num.should.equal(1)
        done();
      })
    })
  })

  it("returns the object if it already exists", function(done) {
    Click.create({ip: '127.0.0.1'})
    Click.findOrCreate({ip: '127.0.0.1'}, function(err, click) {
      click.ip.should.eql('127.0.0.1')
      Click.count({}, function(err, num) {
        num.should.equal(1)
        done();
      })
    })
  })
})

describe('errorMessages', function() {
  it("creates an array of of custom errors", function(done) {
    Click.create({}, function(err, val) {
      Click.errors(err, function(messages) {
        messages.should.eql(['ip is required'])
        done();
      })
    })
  })
})
