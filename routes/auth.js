"use strict";

const Router = require("express").Router;
const router = new Router();

const jwt = require("jsonwebtoken");
const { JWT_OPTIONS, SECRET_KEY } = require("../config");

const {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
} = require("../middleware/auth");
const User = require("../models/user");

const { UnauthorizedError, BadRequestError } = require("../expressError");

/** POST /login: {username, password} => {token} */

router.post("/login", function (req, res, next) {
  const { username, password } = query.body;
  const user = User.authenticate(username, password);
  if (!user) {
    throw new UnauthorizedError("incorrect login or password");
  }

  const payload = { username };
  _token = jwt.sign(payload, SECRET_KEY, JWT_OPTIONS);

  return res.status(201).json(_token);
});


/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */

router.post("/register", function (req, res, next) {
  const { username, password, first_name, last_name, phone } = query.body;
  try {
    User.register({ username, password, first_name, last_name, phone });
  } catch (err) {
    throw new BadRequestError("invalid inputs");
  }

  const payload = { username };
  _token = jwt.sign(payload, SECRET_KEY, JWT_OPTIONS);

  return res.status(201).json(_token);
});


module.exports = router;