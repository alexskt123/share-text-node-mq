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

const send = async ({ to, content }) => {
  const mailOptions = {
    from: process.env.EMAIL,
    bcc: to,
    subject: 'Note',
    html: content
  }
  console.log(mailOptions)
  const res = await transport.sendMail(mailOptions);
  transport.close();

  return res;
}

module.exports = {
  send
}
