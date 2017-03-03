'use strict';

var util = require('util');
var express = require('express');
var path = require('path');
var braintree = require('braintree');
var bodyParser = require('body-parser');
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

console.log(ObjectID);
/**
 * Instantiate your server and a JSON parser to parse all incoming requests
 */
var app = express();
var jsonParser = bodyParser.json();

/**
 * Instantiate your gateway (update here with your Braintree API Keys)
 */
var environment = process.env.BT_ENVIRONMENT.charAt(0).toUpperCase() + process.env.BT_ENVIRONMENT.slice(1);
var gateway = braintree.connect({
  environment:  braintree.Environment[environment],
  merchantId:   process.env.BT_MERCHANT_ID,
  publicKey:    process.env.BT_PUBLIC_KEY,
  privateKey:   process.env.BT_PRIVATE_KEY
});


 // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    console.log("App now running on port", server.address().port);
  });
// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
var database = mongodb.MongoClient.connect(process.env.MONGOLAB_AMBER_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
});

  // Save database object from the callback for reuse.
db = database;

/**
 * Enable CORS (http://enable-cors.org/server_expressjs.html)
 * to allow different clients to request data from your server
 */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var clientPath = path.resolve(__dirname, 'client');

console.log(clientPath);
 app.use(express.static(clientPath));
 app.get('/', function(req, res){
		console.log(clientPath);
     res.sendFile('UserInfo.html', {root: clientPath});
 });


app.use('/scripts', express.static(__dirname + '/node_modules/braintree-web/dist/'));

/**
 * Route that returns a token to be used on the client side to tokenize payment details
 */
app.post('/clientoken', function (request, response) {
  gateway.clientToken.generate({}, function (err, res) {
    if (err) throw err;
    response.json({
      "client_token": res.clientToken
    });
  });
});

/**
 * Route to process a sale transaction
 */
app.post('/process', jsonParser, function (request, response) {
  var transaction = request.body;
  gateway.transaction.sale({
    amount: transaction.amount,
    paymentMethodNonce: transaction.payment_method_nonce
  }, function (err, result) {
    if (err) throw err;
    console.log(util.inspect(result));
    response.json(result);
  });
});

//Create Userinfo
app.post("/api/userInfo", function(req, res) {
  var newContact = req.body;
  newContact[createDate] = new Date();

  db.collection('WifiUserInfo').insertOne(newContact, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new User.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});
