var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/development.js');
var bodyparser = require('body-parser');
var fetch = require('./api/user.js');
var user = require('./api/model.js')
var auth= require('./auth/authServices');
var jwt = require('jsonwebtoken');
var app = express();
var nodemailer = require('nodemailer');
app.use(bodyparser());
app.use(bodyparser.urlencoded({ extended: true }));

//database connection
mongoose.connect(config.dbpath, function(err, db){
    if(err){ console.log("not connected")}
    console.log("connected to db....")
});
var db = mongoose.connection;

//api routes
app.get('/', function(req, res){
    res.send("pointtersss!!!!!!");
});

app.post('/signup',fetch.signup );
app.post('/login', fetch.login);

//update by user_id
/*app.put('/update/:_id', function(req,res){
    var id = req.params._id;
    var body = req.body;
    fetch.update(id,body,function(err,body){
        if(err) throw err;
        res.jsonp(body);
    });
});*/

app.get('/get', fetch.getuser);
//update by auth token
app.put('/update',function(req, res){
    var token = req.headers.authorization;
    if (token) {
        var decoded= jwt.verify(token, config.secret)
        var userId = decoded._id;       
        var body = req.body;
        fetch.updates(userId, body, function(err, body){
        if(err) throw err;
        res.jsonp(body);
    })
    }
    else{
        res.json({msg : "token not provided!!!"});
    }
});

app.post('/user/otp', fetch.otp);
app.post('/user/reset', fetch.reset);


//start server
app.listen(config.port,function(){
    console.log("express listening to %d",  config.port);
});

module.exports=app;