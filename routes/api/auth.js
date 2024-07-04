const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../../controllers/auth");
const { validateBody } = require("../../validation/validation");
const auth = require("../../middlewares/jwtMiddleware");
const { userSchema } = require("../../validation/userValidation");
const passport = require("../../middlewares/passport-config");

router.use(passport.initialize());

router.post("/signup", validateBody(userSchema), register);
router.post("/login", validateBody(userSchema), login);
router.post("./logout", auth, logout);

module.exports = router;
