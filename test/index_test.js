var mocha = require('mocha')
  , should = require('should')
  , sinon = require('sinon')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , supergoose = require('../index.js')

var ClickSchema = new Schema({
  ip : String
})

ClickSchema.plugin(supergoose);
var Click = mongoose.model('Click', ClickSchema);

describe('findOrCreate', function() {
  it("should return the object if it exists", sinon.test(function(done) {
    this.stub(Click, 'findOne').yields(null, {ip: '127.0.0.1'})
    Click.findOrCreate({ip: '127.0.0.1'}, function(err, click) {
      click.should.eql({ip: '127.0.0.1'})
    })
  }))

  it("check to see if the object exists", sinon.test(function() {
    this.mock(Click).expects('findOne')
    Click.findOrCreate({ip: '127.0.0.1'}, function(err, click) {})
  }))

  it("should call create if it doesn't exist", sinon.test(function() {
    this.stub(Click, 'findOne').yields(null, null);
    this.stub(Click, 'create').withArgs({ip: '127.0.0.1'})
    Click.findOrCreate({ip: '127.0.0.1'}, function(err, click) {})
  }))
})
