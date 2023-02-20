// generate code 6 digits
function generateCode() {
    let codigo = '';
    for (let i = 0; i < 6; i++) {
        codigo += Math.floor(Math.random() * 10);
    }
    return codigo;
}

module.exports = {
    generateCode
}