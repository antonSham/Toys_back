const express = require("express");
const { wrap } = require("async-middleware");
const { body } = require("express-validator");
const usersController = require("../controllers/users");
const { sign: signToken } = require("../utils/token");
const auth = require("./middelwares/auth");
const validate = require("./middelwares/validate");
const checkUser = require("./middelwares/checkUser");


const router = express.Router();


router.post(
  "/signup",
  wrap(async (req, res) => {
    const { name, login, email, password } = req.body;
    const { userId } = await usersController.register({
      name,
      login,
      email,
      password,
    });

    const token = signToken(userId);

    res.send({ success: true, token });
  })
);

router.post(
  "/email/confirm/request",
  auth("user"),
  wrap(async (req, res) => {
    await usersController.requestEmailConfirmation({ userId: req.user.id });
    res.send({ success: true });
  })
);

router.get(
  "/email/confirm",
  wrap(async (req, res) => {
    const { user, code } = req.query;
    await usersController.requestEmailConfirmation({
      userId: user,
      confirmationCode: code,
    });
    res.send({ success: true });
  })
);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").isString(),
  validate(),
  wrap(async (req, res) => {
    const { email, password } = req.body;
    const response = await usersController.login({
      email,
      password,
    });
    if (!response) return res.send({ success: false, message: 'Wrong Credetials' })
    const { userId, userRole } = response
    const token = signToken(userId);
    res.send({ success: true, token, role: userRole });
  })
);

router.post(
  "/profile/edit",
  checkUser(),
  wrap(async (req, res) => {
    const { userId } = req.user
    const { name, login, email } = req.body;
    await usersController.editProfile({ userId, name, login, email });

    res.send({ success: true });
  })
);

router.post(
  "/profile/edit/password",
  checkUser(),
  wrap(async (req, res) => {
    const { userId } = req.user
    const { password } = req.body;
    await usersController.editProfilePassword({ userId, password });

    res.send({ success: true });
  })
);

router.post(
  "/role/change",
  auth("admin"),
  body("userId").isNumeric(),
  body("role").custom(
    (value) => ["user", "editor", "admin"].indexOf(value) >= 0
  ),
  validate(),
  wrap(async (req, res) => {
    const { userId, role } = req.body;
    await usersController.changeRole({ userId, role });

    res.send({ success: true });
  })
);

router.post(
  "/del",
  auth("admin"),
  wrap(async (req, res) => {
    const { userId } = req.body;
    await usersController.deleteUser({ userId });

    res.send({
      success: true,
      message: 'Пользователь был успешно удалён'
    });
  })
);

router.get(
  "/one",
  checkUser(),
  wrap(async (req, res) => {
    const { userId } = req.user;
    const user = await usersController.getUserById({ userId });

    res.send({
      success: true,
      user
    });
  })
);

router.get(
  "/list",
  auth("admin"),
  wrap(async (req, res) => {
    const { limit, offset } = req.params;
    const users = await usersController.getUsersList({
      limit: +limit || 10,
      offset: +offset || 0,
    });

    res.send({
      success: true,
      users,
      limit,
      offset,
    });
  })
);

module.exports = router;
