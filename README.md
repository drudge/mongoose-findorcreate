supergoose
==================

[Mongoose](https://github.com/LearnBoost/mongoose) simple plugin adding some handy functions. 
Pretty barebones right now but more will be added as needed.

Installation
------------


`npm install supergoose`

Usage
-----


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
      
License
-------

MIT License
