var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var schema = mongoose.Schema({
    email: 
    {
        type: String,
        unique: true,
        required: true
    },
    
    firstName:
    {
        type: String,
        default: ''
    },
    
    insurance:
    {
        type: String,
        default: ''
    },
    awards:
    {
        type: String,
        default: ''
    },
    
    companyName:
    {
        type: String,
        default: ''
    },

    description:
    {
        type: String,
        default: ''
    },
    
    education:{
        type: String,
        default: ''
    },
      
    license:
    {
          type: String,
          default: ''
    },
    
    location:
    {
        type: Object,
        default: '',
        index:true
    },
    
    gender: 
    {
        type: String,
        default: ''
    },
    
    profilePic:
    {
        type: Object,
        default: '',
    },
    password: {
        type: String,
        required: true
    },
    phone:{
        type: String,
        default: ''
    },
    completedRegistration:
    {
        type: Boolean,
        default: ""
    },
    completedRegistrationDate:
    {
        type: String,
        default: ""
    }, 
    otp :{
        type : String,
        default: ""
    }
    
});

schema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});
 
schema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err,isMatched) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatched);
    });
};

module.exports= mongoose.model('data', schema);