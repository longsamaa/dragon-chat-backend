const mongoose = require('mongoose');

const URL_CONNECT = process.env.URL_MONGOOSE_CONNECT;

module.exports.connectDB = async () => {
    console.log(URL_CONNECT);
    await mongoose.connect(URL_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Connect DB DRAGONCHAT Successful");
}
