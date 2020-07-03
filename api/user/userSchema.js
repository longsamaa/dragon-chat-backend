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
        trim : true,
        unique : true
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
    External_Type : {
        type : String,
        required : true
    },
    Create_at : {
        type : Date,
        required : true
    },
    googleData : {
        type : mongoose.Schema.Types.ObjectID,
        ref : 'googleData',
        required : false
    }
});

module.exports = mongoose.model('User',userSchema);