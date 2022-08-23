"use strict";

const Router = require("express").Router;
const router = new Router();

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

const User = require("../models/user");

const { UnauthorizedError, BadRequestError } = require("../expressError");

/** POST /login: {username, password} => {token} */

router.post("/login", async function (req, res, next) {
  const { username, password } = req.body;
  const user = await User.authenticate(username, password);
  if (!user) {
    throw new UnauthorizedError("incorrect login or password");
  }

  const payload = { username };
  let token = jwt.sign(payload, SECRET_KEY);

  return res.status(201).json({ token });
});


/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */

router.post("/register", async function (req, res, next) {
  const { username, password, first_name, last_name, phone } = req.body;
  try {
    await User.register({ username, password, first_name, last_name, phone });
  } catch (err) {
    throw new BadRequestError("invalid inputs");
  }

  const payload = { username };
  let token = jwt.sign(payload, SECRET_KEY);

  return res.status(201).json({ token });
});


module.exports = router;