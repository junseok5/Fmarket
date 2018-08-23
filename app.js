var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var mysql = require('mysql');
var FacebookStrategy = require('passport-facebook').Strategy;

// Mysql Connection
var conn = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'fmarket',
  charset : 'utf8'
});

// Mysql Error Handling
conn.connect(function(err){
  if (err) console.log(err);
});

// Mysql Set Encoding
conn.query('set names utf8', function(error, result, fields){
  if(error) throw error;
  console.log('set names ok!');
});

// Set Session
app.use(session({
    secret : "@#$adf4e2!$#@#$@#$34#@$!5647^(*%&(%))",
    resave : false,
    name   : "sessionId",
    saveUninitialized : false
}));

// passpor setting
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// ejs setting
app.set('view engine','ejs');
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

/*******************************************
                  Route Start
********************************************/
// User Page Route
var homeRoute = require('./routes/homeRoute')(conn, express);
app.use('/', homeRoute);

var myInfoRoute = require('./routes/myInfoRoute')(conn, express);
app.use('/', myInfoRoute);

var sellerRoute = require('./routes/sellerRoute')(conn, express);
app.use('/', sellerRoute);

// Facebook Connection Route
var fbRoute = require('./routes/facebookRoute')(conn, passport, FacebookStrategy);
app.use('/', fbRoute);

var postsRoute = require('./routes/postsRoute')(conn, express, io);
app.use('/', postsRoute);


/* Server listening */
server.listen(3000, function(){
  console.log("Connected 3000 port!");
});
