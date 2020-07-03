const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    nickname : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required: true,
        trim : true
    },
    password : {
        type : String,
        required : false
    },
    hashPassword : {
        type : String,
        required : false
    },
    isActive : {
        type : Boolean,
        default : false
    },
    imageURL : {
        type : String,
        required : false
    },
    googleId : {
        type : String,
        required : false
    }
});

module.exports = mongoose.model('User',userSchema);