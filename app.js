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
