var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var moment 	 = require('moment');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var jsonParser = bodyParser.json();
var {PORT, DATABASE_URL} = require('./config/database');

// add mongoose promise setup
mongoose.Promise = global.Promise;


require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(jsonParser); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static(__dirname+"/public"))
app.use(bodyParser.urlencoded({ extended : false }));


require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
var Food = require('./app/models/food');


var runServer = function(cb){
  mongoose.connect(DATABASE_URL, function(err){
    if(err && cb){
      return cb(err);
    }
    app.listen(PORT, function(){
      console.log('Listening on PORT:', PORT);
      if(cb){
        cb();
      }
    })
  })
};

var closeServer = function() {
  mongoose.disconnect().then(() => {
    console.log('Closing Server');
    server.close(err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

if(require.main === module){
  runServer(function(err){
    if(err){
      console.log(err);
    }
  })
 }

module.exports = {runServer, app, closeServer};
