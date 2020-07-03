const mongoose = require('mongoose');

const googleDataSchema = mongoose.Schema({
    googleId : {
        type : String,
        required: true
    },
    access_Token : {
        type : String,
        required : true
    },
})

module.exports = mongoose.model('googleData',googleDataSchema);