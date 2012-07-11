supergoose
==================

[Mongoose](https://github.com/LearnBoost/mongoose) simple plugin adding some 
handy functions. 

```javasript
/* Adds find or create functionality to mongoose models. This is handy
 * for libraries like passport.js which require it
 */
Model.findOrCreate()

/* Parses the complex validation errors return from mongoose into a simple
 * array of messages to be displayed as flash messages or something similar
 */
Model.errors()
```

Installation
------------

`npm install supergoose`

Usage
-----

# findOrCreate

```javascript
var supergoose = require('supergoose')
var ClickSchema = new Schema({ ... });
Click.plugin(supergoose);
var Click = mongoose.model('Click', ClickSchema);
```

The Click model now has a findOrCreate static method

```javascript
Click.findOrCreate({ip: '127.0.0.1'}, function(err, click) {
  console.log('A new click from "%s" was inserted', click.ip);
  Click.findOrCreate({}, function(err, click) {
    console.log('Did not create a new click for "%s"', click.ip);
  })
});
```

You can also include properties that aren't used in the 
find call, but will be added to the object if it is created.

```javascript
Click.create({ip: '127.0.0.1'}, {browser: 'Mozilla'}, function(err, val) {
  Click.findOrCreate({ip: '127.0.0.1'}, {browser: 'Chrome'}, function(err, click) {
    console.log('A click from "%s" using "%s" was found', click.ip, click.browser);
    // prints A click from "127.0.0.1" using "Mozilla" was found
  })
});
```

# errors
```javascript
var supergoose = require('supergoose')
var ClickSchema = new Schema({ip: {type: String, required: true}});
Click.plugin(supergoose, {messages: {'required': '%s is a required field'}});
var Click = mongoose.model('Click', ClickSchema);
```

The Click model now has an errors static method

```javascript
Click.create({}, function(err, click) {
  if(err) {
    Click.errors(err, function(messages) {
      console.log(messages);
      // outputs ['ip is a required field']
    }) 
  }
});
```
      
License
-------

MIT License
