const UserAddress = require("../models/user-address");

const userAddress = async (req, res) => {
    const { id:user_id } = req.user;
    try {
        const address = await UserAddress.findAll({ where: {user_id}});
        if(!address) {
            return res.status(200).json({success: 'user not address'});
        }
        return res.status(200).json({success: address});
    } catch (error) {
        return res.status(400).json({error: 'error, not posible address'});
    }
}

const userCreateAddress = async (req, res) => {
    const { id:user_id } = req.user;
    const { name, address, latitude, longitude, type } = req.body;
    
    try {
        const create = await UserAddress.create({user_id, name, address, latitude, longitude, type});
        if(create) {
            return res.status(200).json({ success: "ok", data: create});
        }
        return res.status(400).json({ error: "error, create address"});
    } catch (error) {
        return res.status(400).json({ error: "imposible create address"});
    }
}

const userDeleteAddress = async (req, res) => {
    const { id: user_id } = req.user;
    const { id } = req.params;
    try {
        const removes = await UserAddress.destroy({ where: { id, user_id } });
        if (!removes) {
            return res.status(400).json({ error: "error deleting an address" });
        }
        return res.status(200).json({ success: "ok" });
    } catch (error) {
        return res.status(400).json({ error: "imposible delete address" });
    }
}

const userUpdateAddress = async (req, res) => {
    const { id: user_id } = req.user;
    const { id } = req.params;
    const { name, address, latitude, longitude, type } = req.body;
    try {

        let obj = {
            ...(name) && {name},
            ...(address) && {address},
            ...(latitude) && {latitude},
            ...(longitude) && {longitude},
            ...(type) && {type},
        };

        const updating = await UserAddress.update(obj, { where: { id, user_id }});
        if (!updating) {
            return res.status(400).json({ error: "error update address" });
        }
        return res.status(200).json({ success: "ok" });
    } catch (error) {
        return res.status(400).json({ error: "imposible update address" });
    }
}


module.exports = {
    userAddress,
    userCreateAddress,
    userDeleteAddress,
    userUpdateAddress
}