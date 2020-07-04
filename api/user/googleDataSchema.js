const mongoose = require('mongoose');

const googleDataSchema = mongoose.Schema({
    iss : {
        type : String,
        required : false
    },
    azp : {
        type : String,
        required: false
    },
    aud : {
        type : String,
        required : false,
    },
    sub : {
        type : String,
        required : false
    },
    email : {
        type : String,
        required : false
    },
    email_verified : {
        type : Boolean,
        required : false,
    },
    name : {
        type : String,
        required : false,
    },
    at_hash : {
        type : String,
        required : false
    },
    picture : {
        type : String,
        required : false
    },
    given_name : {
        type : String,
        required : false
    },
    family_name : {
        type : String,
        required : false
    },
    locale : {
        type : String,
        required : false
    }
})

module.exports = mongoose.model('googleData',googleDataSchema);