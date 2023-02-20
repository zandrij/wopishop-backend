const sequelize = require("../database/conexion");
const Sequelize = require("sequelize");


const UserSession =  sequelize.define('users_sessions', {
    user_id: {
        type: Sequelize.BIGINT,
        unique: true
    },
    token: {
        type: Sequelize.STRING
    }
}, { timestamps:false }
);

module.exports = UserSession;