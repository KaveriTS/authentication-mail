const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

//connect to database
mongoose.connect("mongodb://localhost:27017/User-auth");
mongoose.Promise = global.Promise;

//middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//import routes
app.use ('/api', require('./route/userRoute'));

//import models
require('./models/userModel');

//error handling
app.use(function(err, req, res, next){
    console.log(err);
    res.status(422).send({error: err.message});
});
//listen to port
app.listen(process.env.PORT, (err) => {
    if (err) {  
        console.log('Error ', err);
    }
    console.log('Node.js is running at PORT',process.env.PORT)
});