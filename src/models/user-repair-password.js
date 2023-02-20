const sequelize = require("../database/conexion");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

const UserPassword = sequelize.define('users_password_repair',{
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
}, {timestamps: false, freezeTableName: true}
);

// Antes de guardar un usuario, cifra su contraseña
UserPassword.beforeCreate((info, options) => {
    return bcrypt.hash(info.token, 10)
    .then((hash) => {
        info.token = hash;
    });
});


module.exports = UserPassword;