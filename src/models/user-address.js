const sequelize = require("../database/conexion");
const Sequelize = require("sequelize");

const UserAddress = sequelize.define('users_address', {
    user_id: {
        type: Sequelize.BIGINT
    },
    name: {
        type: Sequelize.STRING
    },
    address: {
        type: Sequelize.STRING
    },
    latitude: {
        type: Sequelize.STRING
    },
    longitude: {
        type: Sequelize.STRING
    }, 
    type: {
        type: Sequelize.INTEGER
    }
}, { timestamps:false, freezeTableName: true }
);

module.exports = UserAddress;