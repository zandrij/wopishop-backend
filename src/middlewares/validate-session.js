const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserSession = require("../models/user-session-model");
require('dotenv').config();

//validate session token = token database
const validateSession = async (req, res, next) => {
    const token = req.headers["x-wopi"];
    if (!token) {
        return res.status(401).json({error:"Access denied. No token provided."});
    }

    try {
        //verified token
        const user = jwt.verify(token, process.env.SECRET);
        req.user = user;

        const info = await UserSession.findOne({ where : { user_id : user.id }, attributes: ['token']});
        if(info) {
            let validate = await bcrypt.compare(token, info.token);
            if(validate){
                next();
            }else{
                return res.status(400).send({error: "Invalid token."});
            }
        }else{
            return res.status(400).json({error: 'not posible validate session'});
        }
    } catch (error) {
        return res.status(400).json({error: 'not posible validate session'});
    }
}

module.exports = {
    validateSession
};
