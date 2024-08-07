const jwt = require("jsonwebtoken");
const User = require("../service/schemas/user");
const gravatar = require("gravatar");
const fs = require("fs").promises;
const path = require("path");
const jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");
const { sendVerificationEmail } = require("../modules/nodemailer");

require("dotenv").config();

const secret = process.env.SECRET;

const register = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const verificationToken = uuidv4();

    const newUser = new User({ email, verificationToken });
    newUser.setPassword(password);
    newUser.avatarURL = gravatar.url(email, { protocol: "https", s: "100" });
    await newUser.save();

    try {
      await sendVerificationEmail(email, verificationToken);
      res.status(201).json({
        status: "success",
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to send verification email" });
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.validPassword(password) || !user.verify) {
      return res.status(401).json({
        message:
          "Email or password is wrong or you have not verified your email",
      });
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
      return res.status(401).json({ message: "Not authorized" });
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

const avatarsDir = path.join(__dirname, "../public/avatars");

const updateAvatar = async (req, res, next) => {
  try {
    const { path: tmpPath, originalname } = req.file;
    const { _id: userId } = req.user;

    const img = await jimp.read(tmpPath);
    await img.resize(250, 250).writeAsync(tmpPath);

    const uniqueName = `${userId}-${Date.now()}-${originalname}`;
    const avatarURL = path.join("avatars", uniqueName);
    const publicPath = path.join(avatarsDir, uniqueName);

    await fs.rename(tmpPath, publicPath);

    await User.findByIdAndUpdate(userId, { avatarURL }, { new: true });

    res.json({
      status: "success",
      code: 200,
      data: {
        avatarURL: `${process.env.V_URL}:${
          process.env.MAIN_PORT || 3000
        }/${avatarURL}`,
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
  updateAvatar,
};
