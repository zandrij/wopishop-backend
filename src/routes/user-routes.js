const express = require('express');
const { check, param } = require('express-validator');
const { userAddress, userCreateAddress, userDeleteAddress, userUpdateAddress } = require('../controllers/address-controller');
const validateField = require('../middlewares/field-validate');
const { validateSession } = require('../middlewares/validate-session');
const router = express.Router();

/// --------------------- ADDRESS --------------------- ///
// all user addresss
router.get('/user/address', validateSession, userAddress);
// create user address
router.post('/user/address', [
    check('name', 'name address is required').isString().notEmpty(),
    check('address', 'address is required').isString().notEmpty(),
    check('latitude', 'latitude is required').isString().notEmpty(),
    check('longitude', 'longitude is required').isString().notEmpty(),
    check('type', 'type is required').isInt().notEmpty(),
    validateField
] , validateSession, userCreateAddress);
// delete user address
router.delete('/user/address/:id', [
    param('id', 'id is required').notEmpty().isLength({ min: 1}),
    validateField
] , validateSession, userDeleteAddress);
// update user address
router.put('/user/address/:id', [
    param('id', 'id is required').notEmpty().isLength({ min: 1}),
    check('name', 'name address is required').isString(),
    check('address', 'address is required').isString(),
    check('latitude', 'latitude is required').isString(),
    check('longitude', 'longitude is required').isString(),
    check('type', 'type is required').isInt(),
    validateField
], validateSession, userUpdateAddress);

module.exports = router;