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

const sendEmail = async (email, code) => {
    let url = `${process.env.URL_SERVER}active-account/${code}`
    let content = `<b>Activa tu cuenta desde el siguiente enlace <a href=${url} target="_blank">Activar</a></b>`

    await transporter.sendMail({
        headers: {
            priority: 'high',
        },
        from: 'Activar Wopishop <info@wopishop.com>',
        to: `${email}`,
        subject: "Activar cuenta Wopishop",
        text: "Bienvenido a Wopishop",
        html: content
    });
}

module.exports = {
    sendEmail
};