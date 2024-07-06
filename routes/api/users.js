const express = require("express");
const router = express.Router();
const ctrlAuth = require("../../controllers/auth");
const { validateBody } = require("../../validation/validation");
const auth = require("../../middlewares/jwtMiddleware");
const { userSchema } = require("../../validation/userValidation");
const passport = require("../../middlewares/passport-config");

router.use(passport.initialize());

router.post("/signup", validateBody(userSchema), ctrlAuth.register);
router.post("/login", validateBody(userSchema), ctrlAuth.login);
router.get("/logout", auth, ctrlAuth.logout);
router.get("/current", auth, ctrlAuth.getCurrentUser);
router.patch("/", auth, ctrlAuth.updateSubscription);

module.exports = router;
