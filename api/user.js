var user = require('./model.js');
var config = require('../config/development');
var jwt = require('jsonwebtoken');
var auth = require('../auth/authServices.js');
var validator = require("email-validator");
var http = require('http');
var nodemailer = require('nodemailer');
var randomstring = require("randomstring");

//signup
exports.signup = function(req, res){
    //if email or password are not entered
    if(!req.body.email || !req.body.password){
        res.jsonp({status: 202, msg: "enter email and passsword"});
    }
    else
    {  
        var passw = req.body.password;
        if(passw.length >= 8) //password validation
        {
            var val= validator.validate(req.body.email);
            if (val == true)
            {
                var newUser = new user({
                email : req.body.email,
                password: req.body.password
            });
            newUser.save(function(err, savedUser){
            if(err)
            {
                res.json({msg:"email exists"});
            }
            else{
            var token = auth.signToken(savedUser._id, savedUser.email);
            //console.log(savedUser._id);
            //console.log(savedUser.email);
            res.jsonp({id: savedUser._id ,msg: 'created a new user.', token: token});
            }
        });
            }
               
            else{
                res.json({status:202,msg : "invalid format"});
                }
        }
        else{
                res.send("password error");
            }
    }
    
};

//login
exports.login= function(req,res){
    user.findOne({email: req.body.email}, function(err, User){
        if(err) throw err;
        if(!user){
            res.json({msg: "user doesnot exist"});
        }
        else{
                User.comparePassword(req.body.password, function(err,isMatched){                  
                    if(isMatched && !err){
                        var token = auth.signToken(User._id,  User.email, config.secret);
                        //console.log(User._id);
                        //console.log(User.email);
                        res.json({msg:"success", token: token});
                    }
                    else{
                        res.send("authentication failed");
                    }
                });
        }
    });
};
// get user by auth token
exports.getuser= function(req,res){
    var token = req.headers.authorization;
   // console.log(req.headers.authorization);
          if (token) {
            try{   
            var decoded= jwt.verify(token, config.secret)
                var userId = decoded._id;        
                //console.log(decoded);
               user.findOne({_id: userId}).then(function(user){
                    //console.log(user);
                    res.json(user);
                    res.end();
                    
                });
              } 
            catch(e)
            {
                res.status(400);
                res.json({msg: "error!"});
            }    
        }
    }

//update by user id
/*exports.update = function(id, User, callback){
    var id = {_id: id};
    var up = {
        firstName: User.firstName,
        insurance: User.insurance,
        awards: User.awards,
        companyName: User.companyName,
        description: User.description,
        education: User.education,
        license: User.license,
        location: User.location,
        gender: User.gender,
        profilePic: User.profilePic,
        phone: User.phone
    }
    user.findOneAndUpdate(id, up, callback);
}
*/

//update by auth token
exports.updates = function(id, User, callback){
    var id = {_id: id};
    var up = {
        firstName: User.firstName,
        insurance: User.insurance,
        awards: User.awards,
        companyName: User.companyName,
        description: User.description,
        education: User.education,
        license: User.license,
        location: User.location,
        gender: User.gender,
        profilePic: User.profilePic,
        phone: User.phone
    }
    user.findOneAndUpdate(id, up, callback);
}


//otp
exports.otp = function(req, res){
    var email = req.body.email;
    //console.log(email);
    var token = req.headers.authorization;  
    if(token){
    var decoded = jwt.verify(token, config.secret);
    var userId = decoded._id;
    //console.log(userId);
    var pass = randomstring.generate(8); 
    user.findOne({_id: userId}).then(function(user){
        
            //console.log(user.email);
                if(user.email == email){
                    user.otp = pass;
                    user.save(function(err){
                        if(err) throw err;
                        //console.log("done" + " " + user.email + " " + user.otp );
                        res.json({
                            email: user.email,
                            otp : user.otp 
                    })
           
            })
        }
            else{
               //console.log("wrong email");
               res.json({msg : "Wrong email"});
           }
          
        
    })

}
    else{
        res.send("token not provided");
    }
}

exports.reset = function(req, res){
    var email = req.body.email;
    var pass = req.body.password;
    var otp = req.body.otp;
    user.findOne({otp: otp}).then(function(user){
        if(user.email == email && user.otp == otp){
            if(!pass){
                res.send({msg : "enter the password"});
            }
            user.password = pass;
            user.otp = "";
            user.save(function(err){
                if(err) {
                    res.json({msg : "invalid password"});
                };
                res.json({msg: "password changed", password: pass});
            }) ;
            
    }
    else{
      //  console.log('invalid credentials');
        res.json({msg : "Invalid credentials"})
    }
    });
    
    
}