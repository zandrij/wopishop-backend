const sequelize = require("../database/conexion");
const Sequelize = require("sequelize");

const ActiveUser = sequelize.define('users_activation', {
    user_id: {
        type: Sequelize.BIGINT,
        unique: true
    },
    token: {
        type: Sequelize.STRING
    },
    expired_at: {
        type: Sequelize.DATE
    }
}, {timestamps:false,  freezeTableName: true}
);

module.exports = ActiveUser;