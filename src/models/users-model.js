const sequalize = require("../database/conexion");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

const User = sequalize.define("users", {
    name: {
        type: Sequelize.STRING
    },
    last_name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    phone: {
        type: Sequelize.STRING,
    },
    password: {
        type: Sequelize.STRING
    },
    state: {
        type: Sequelize.TINYINT
    }
}, { timestamps: false }
);

User.beforeUpdate(async (user, options) => {
    if (user.changed('password')) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    }
});

// Antes de guardar un usuario, cifra su contraseña
User.beforeCreate((user, options) => {
    return bcrypt.hash(user.password, 10).then((hash) => {
        user.password = hash;
    });
});

module.exports = User;