const { validationResult } = require("express-validator");
const User = require("../models/users-model");
const bcrypt = require('bcrypt');
const { sendEmail } = require("../api/mailer");
const { uid } = require("uid");
const ActiveUser = require("../models/active-model");
const UserSession = require('../models/user-session-model');
const dayjs = require("dayjs");
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { RepairPassworEmail } = require("../api/forgot-password");
const UserPassword = require("../models/user-repair-password");
const { generateCode } = require("../api/utils");

// register user 
const registerUser = async (req, res) => {
  try {
    const { name, lastName, email, phone, password } = req.body;
    //validate email
    const emailValid = await User.findOne({ where: { email }, attributes: ['email'] });
    if (emailValid) {
      return res.status(400).json({ error: 'email exiting' });
    } else {
      //crete user
      const create = await User.create({ name, last_name: lastName, email, phone, password, state: false });
      if (create) {
        // create token activation user
        const code = uid(25);
        // send email and save user activation token
        await registerTokenActivation(create.id, code, email, res);
      } else {
        return res.status(400).json({ error: 'imposible register user' });
      }
    }
  } catch (error) {
    return res.status(400).json({ error: 'not posible register' });
  }
}
// save token regiter user
const registerTokenActivation = async (user_id, token, email, res) => {
  try {
    let date = dayjs();
    let newDate = date.add(1, 'day');

    const activationSave = ActiveUser.create({ user_id, token, expired_at: newDate });

    if (activationSave) {
      await sendEmail(email, token).then(async () => {
        return res.status(200).json({ succes: 'email send' });
      })
        .catch(() => {
          return res.status(400).json({ error: 'email confirmation no send, resend' });
        })
    } else {
      return res.status(400).json({ error: 'error save token activation user' });
    }
  } catch (error) {
    return res.status(400).json({ error: 'error register token activation' });
  }
}
// active account user
const activeAccount = async (req, res) => {
  try {
    // search token information
    const result = await ActiveUser.findOne({ where: { token: req.params.token } })
    if (!result) {
      return res.status(400).json({ error: 'error actived account, contact sopport' });
    }

    let id = result.user_id;
    const update = await User.update({ state: true }, { where: { id } });

    if (!update) {
      return res.status(200).json({ warning: 'user is already activated' });
    }

    await result.destroy();
    return res.status(200).json({ success: 'ok' });

  } catch (error) {
    return res.status(400).json({ error: 'imposible actived account' })
  }
}
// login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'invalid credentials' });
    }

    if (user.state === 0) {
      return res.status(400).json({ error: 'user inactive' });
    }
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      return res.status(401).json({ error: 'invalid credentials' });
    }

    let newUser = { ...user.dataValues };
    delete newUser.password;
    //create session user
    await createSession(newUser, res);

  } catch (error) {
    return res.status(400).json({ error: 'not posible login' });
  }
}
// create session user
const createSession = async (user, res) => {
  try {
    // clean objetc user
    let objetPlain = { ...user };
    //generate token jwt
    let token = jwt.sign(objetPlain, process.env.SECRET, { expiresIn: "365d" });
    //encrypt token
    const tokenEncrypt = await bcrypt.hash(token, 10);
    if (!tokenEncrypt) {
      return res.status(400).json({ error: 'not posible generate session' });
    }

    //search token session 
    const search = await UserSession.findOne({ where: { user_id: objetPlain.id } });
    // delete session token existing
    if (search) {
      await search.destroy();
    }

    // save token session
    const saving = await UserSession.create({ user_id: objetPlain.id, token: tokenEncrypt });

    if (!saving) {
      return res.status(400).json({ error: 'not posible login session' })
    }

    return res.status(200).json({ success: true, data: objetPlain, token });

  } catch (error) {
    return res.status(400).json({ error: 'imposible generate session' });
  }
}
// return user information logged
const getUser = async (req, res) => {
  try {
    const token = req.headers["x-wopi"];
    const decoded = jwt.verify(token, process.env.SECRET);
    return res.status(200).json({ success: true, user: decoded });
  } catch (error) {
    return res.status(400).send("Invalid token.");
  }
}
//forgot password
const reloadPassword = async (req, res) => {
  try {
    const { email } = req.body;

    //search user password
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'not user repair password' });
    }

    let code = generateCode();
    let date = dayjs();
    let newDate = date.add(1, 'day');

    // consult existing user code
    const consult = await UserPassword.findOne({ where: { user_id: user.id } });
    if (consult) {
      await consult.destroy();
    }

    // save code user
    const save = await UserPassword.create({ user_id: user.id, token: code, expired_at: newDate });
    if (!save) {
      return res.status(400).json({ error: 'not user repair password' });
    }

    // send code email
    await RepairPassworEmail(email, code)
      .then(() => {
        return res.status(200).json({ success: 'email code send' });
      })
      .catch(() => {
        return res.status(400).json({ error: 'not user repair password' });
      })
  } catch (error) {
    return res.status(400).json({ error: 'not user repair password' });
  }
}
// validate code password reset 
const validCodePassword = async (req, res) => {
  try {
    const { email, code } = req.body;

    const validUser = await User.findOne({ where: { email } });
    // search existing email
    if (!validUser) {
      return res.status(400).json({ error: 'user invalid account' });
    }

    // search existing email and code
    const validCode = await UserPassword.findOne({ where: { user_id: validUser.id } });
    if (!validCode) {
      return res.status(400).json({ error: 'not existing code' });
    }

    const compare = await bcrypt.compare(code, validCode.token);
    if (!compare) {
      return res.status(400).json({ error: 'invalid code' });
    }

    //remove code 
    await validCode.destroy();
    await createSession(validUser.dataValues, res);

  } catch (error) {
    return res.status(400).json({ error: 'not posible validate code' });
  }
}
// new password user - forgot
const newPasswordUser = async (req, res) => {
  try {
    const { id } = req.user;
    const { password } = req.body;

    const user = await User.findByPk(id);
    user.password = password;
    await user.save();

    return res.status(200).json({ success: 'ok' });

  } catch (error) {
    return res.status(400).json({ error: 'imposible update password' });
  }
}

module.exports = {
  registerUser,
  loginUser,
  activeAccount,
  getUser,
  reloadPassword,
  validCodePassword,
  newPasswordUser
}