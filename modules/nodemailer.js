const nodemailer = require("nodemailer");
const { M_USER, M_PASS } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  secure: false,
  auth: {
    user: M_USER,
    pass: M_PASS,
  },
});

// const verificationEmail = async (recipient, subject, html) => {
//   const info = await transporter.sendMail({
//     from: '"Contacts Database" <noresponse@contacts.com>',
//     to: recipient,
//     subject,
//     html,
//   });

//   return info;
// };

module.exports = transporter;
