const nodemailer = require("nodemailer");
const { M_USER, M_PASS } = process.env;

require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  secure: false,
  auth: {
    user: M_USER,
    pass: M_PASS,
  },
});

const sendVerificationEmail = async (email, verificationToken) => {
  const mailOptions = {
    from: '"Marta Test 👻" <contact@contact.com>',
    to: email,
    subject: "Verify your email",
    html: `<a href="http://localhost:${
      process.env.MAIN_PORT || 300
    }/api/users/verify/${verificationToken}>Verify your email</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to: " + email);
  } catch (error) {
    console.error("Error sending verification email: ", error);
    throw error;
  }
};

module.exports = { sendVerificationEmail };
