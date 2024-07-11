const jwt = require("jsonwebtoken");
const User = require("../service/schemas/user");
const gravatar = require("gravatar");

require("dotenv").config();

const secret = process.env.SECRET;

const register = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const newUser = new User({ email });
    newUser.setPassword(password);
    newUser.avatarURL = gravatar.url(email);
    await newUser.save();

    res.status(201).json({
      status: "success",
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.validPassword(password)) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "3d" });

    user.token = token;
    await user.save();

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Not authorized",
      });
    }

    user.token = null;
    await user.save();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not suthorized" });
    }
    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const { subscription } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { subscription },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "User not found",
      });
    }

    res.json({
      status: "sucess",
      code: 200,
      data: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
};
