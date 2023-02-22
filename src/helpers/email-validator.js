const User = require("../models/users-model");

const EmailValidator = async (email) => {
    const consut = await User.findOne({ where: { email }});
    if(consut){
        throw new Error('Email existing');
    }
}


module.exports = EmailValidator;