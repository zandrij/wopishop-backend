const express = require('express');
const { check } = require('express-validator');
const { 
    registerUser,
    loginUser,
    getUser,
    reloadPassword,
    validCodePassword,
    newPasswordUser
 } = require('../controllers/auth-controller') ;
const EmailValidator = require('../helpers/email-validator');
const validateField = require('../middlewares/field-validate');
const { validateSession } = require('../middlewares/validate-session');


const router = express.Router();
// user register
router.post('/register', [
    // name
    check('name', 'name is required').isString().notEmpty(),
    //last name
    check('lastName', 'lastname is required').isString().notEmpty(),
    // email
    check('email', 'email is required').isEmail().normalizeEmail().withMessage('email invalid').custom((value) => EmailValidator(value)),
    // phone
    check('phone', 'phone is required').isString().notEmpty(),
    // password
    check('password', 'password is required').isLength({ min: 8 }).withMessage('minimum 8 digits').notEmpty().exists(),
    //password confirmation
    check('passwordConfirmation', 'password does not match').isLength({ min: 8 }).withMessage('minimum 8 digits')
        .notEmpty().withMessage('passwordConfirmation is required').exists().custom((value, { req }) => value === req.body.password),
    validateField
], registerUser);
// user login
router.post('/login', [
    //email
    check('email', 'Email required').notEmpty().isEmail().normalizeEmail().withMessage('email invalid'),
    // password
    check('password', 'password required').notEmpty().isLength({ min: 8 }).withMessage('minimum 8 digit'),
    validateField
], loginUser);
// user information
router.get('/user', validateSession, getUser);
// forgot password
router.post('/forgot-password', [
    check('email', 'email required').notEmpty().isEmail().normalizeEmail().withMessage('invalid email'),
    validateField
], reloadPassword);
// validate code forgot password
router.post('/validate-code-password', [
    check('email', 'email required').notEmpty().isEmail().normalizeEmail().withMessage('email invalid'),
    check('code', 'code required').notEmpty().isLength({ min: 6, max: 6 }).withMessage("code length invalid"),
    validateField
], validCodePassword);

router.post('/repair-password', [
    check('password', 'password is required').isLength({ min: 8 }).withMessage('minimum 8 digits').notEmpty().exists(),
    check('passwordConfirmation', 'password does not match').isLength({ min: 8 }).withMessage('minimum 8 digits').notEmpty()
        .exists().custom((value, { req }) => value === req.body.password),
    validateField,
], validateSession, newPasswordUser);

module.exports = router;