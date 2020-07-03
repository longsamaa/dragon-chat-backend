const User = require('../api/user/userSchema');
const googleData = require('../api/user/googleDataSchema');
module.exports.validationRegistration = (user) => {
    let error = [];
    if(!user.nickname || !user.email || !user.password) {
        console.log('error1');
        return false;
    }
    //check nickname
    const format = /^[A-Za-z0-9_.]+$/;
    if(user.nickname.length < 6 || !format.test(String(user.nickname).toLowerCase())){
        console.log('error2');
        return false;
    }
    //check email
    const formatEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!formatEmail.test(String(user.email).toLowerCase())){
        console.log('error3')
        return false;
    }
    //check password
    if(user.password.length < 6){
        console.log('error4');
        return false;
    }
    return true ;
}
module.exports.checkEmailExists = async (email) => {
    const emailExists = await User.findOne({email : email});
    if(emailExists) {
        return emailExists;
    }
    return null;
}
module.exports.validationLogin = (user) => {
    if(!user.email) {
        console.log('error 1');
        return false;
    }
    const formatEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!formatEmail.test(String(user.email).toLowerCase())){
        console.log('error 2');
        return false;
    }
    return true;
}
module.exports.validationLoginWithGoogle = (user) => {
    if(!user.email || !user.response || !user.response.nickname || !user.response.imageURL || !user.response.googleId || !user.response.access_Token){
        console.log('error1');
        return false;
    }
    const formatEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!formatEmail.test(String(user.email).toLowerCase())){
        console.log('error2');
        return false;
    }
    const formatImage = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
    if(!formatImage.test(String(user.response.imageURL).toLowerCase())){
        console.log('error3');
        return false;
    }
    return true;
}
// module.exports.validationLoginWithGoogle = (user) => {
//     if(!user.email || !user.googleId || !user.nickname || !user.imageURL){
//         console.log('error1');
//         return false;
//     }
//     const formatEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     if(!formatEmail.test(String(user.email).toLowerCase())){
//         console.log('error2');
//         return false;
//     }
//     const formatImage = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
//     if(!formatImage.test(String(user.imageURL).toLowerCase())){
//         console.log('error3');
//         return false;
//     }
//     return true;
// }