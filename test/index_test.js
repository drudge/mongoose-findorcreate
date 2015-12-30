
/**
 * @list dependencies
 **/

var mocha = require('mocha');
var should = require('should');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('../');

mongoose.connect('mongodb://localhost/findOrCreate')
mongoose.connection.on('error', function (err) {
  console.error('MongoDB error: ' + err.message);
  console.error('Make sure a mongoDB server is running and accessible by this application')
});

var ClickSchema = new Schema({
  ip : {type: String, required: true}
})

ClickSchema.plugin(findOrCreate);

var Click = mongoose.model('Click', ClickSchema);

after(function(done) {
  mongoose.connection.db.dropDatabase();
  done();
})

describe('findOrCreate', function() {

  it("Should output a promise if no callbacks are passed", function(done){
    var oneArgPromise = Click.findOrCreate({ip: '127.0.0.4'});
    (oneArgPromise).should.be.a.Promise();

    var twoArgPromise = Click.findOrCreate({ip: '127.1.1.4'}, {ip: '127.1.1.4'});
    (twoArgPromise).should.be.a.Promise();

    done();
  });

  it("The request should be fulfilled", function(){
    var promise = Click.findOrCreate({ip: '127.0.0.3'});
    return (promise).should.be.fulfilled();
  });

  // it("Returns the object from the promise", function(){

  // });

  it("should create the object if it doesn't exist", function(done) {
    Click.findOrCreate({ip: '127.0.0.1'}, function(err, click) {
      click.ip.should.eql('127.0.0.1')
      Click.count({ip: '127.0.0.1'}, function(err, num) {
        num.should.equal(1);
        done();
      });
    });
  });

  it("returns the object if it already exists", function(done) {
    Click.create({ip: '127.0.0.2'}, function(){
      Click.findOrCreate({ip: '127.0.0.2'}, function(err, click) {
        click.ip.should.eql('127.0.0.2')
        Click.count({ip: '127.0.0.2'}, function(err, num) {
          num.should.equal(1);
          done();
        });
      });
    });
  });

  it("should pass created as true if the object didn't exist", function(done) {
    Click.findOrCreate({ip: '127.1.1.1'}, function(err, click, created) {
      created.should.eql(true);
      done();
    });
  });

  it("should pass created as false if the object already exists", function(done) {
    Click.findOrCreate({ip: '127.1.1.1'}, function(err, click, created) {
      created.should.eql(false);
      done();
    });
  });
});