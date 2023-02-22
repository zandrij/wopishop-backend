require('dotenv').config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
});

const RepairPassworEmail = async (email, code) => {
    let content = `<h4>Para cambiar su contraseña utilize el siguiente código: <b>${code}</b> </h4>`

    await transporter.sendMail({
        headers: {
            priority: 'high',
        },
        from: 'Recuperar Contraseña - Wopishop <info@wopishop.com>',
        to: `${email}`,
        subject: "Recuperar Contraseña",
        text: "Recuperar Contraseña",
        html: content
    });
}

module.exports = {
    RepairPassworEmail
};