const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.GMAIL_APP_PW
  }
});

const send = ({ to, msg }) => {
  const mailOptions = {
    from: process.env.EMAIL,
    bcc: to,
    subject: 'Note',
    html: msg.content.toString()
  }
  transport.sendMail(mailOptions);
}

module.exports = {
  send
}