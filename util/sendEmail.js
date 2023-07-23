// eslint-disable-next-line import/no-extraneous-dependencies
// const nodeMailer = require("nodemailer");
// eslint-disable-next-line import/no-extraneous-dependencies
// const sgTransport = require("nodemailer-sendgrid-transport");
const sendgrid = require("@sendgrid/mail");
//send mail using Gamail
// const sendEmail = async (options) => {
//   //transport is a service that use to send email
//   ///u can use mailtrap,mailgun,sendgrid
//   //send email using gmail
//   const transport = nodeMailer.createTransport({
//     host: process.env.EMAILHOST,
//     port: process.env.EMAILPORT,
//     secure: true, //if secure false then port=587,
//     auth: {
//       api_key: process.env.EMAILUSER,
//       pass: process.env.EMAILPASS,
//     },
//   });

//   const mailOption = {
//     from: "E-shop",
//     to: options.email,
//     subject: options.subject,
//     Text: options.text,
//   };

//   await transport.sendMail(mailOption);
// };

//send mail using sendgrid

// const sgTOptions = {
//   auth: {
//     api_key:
//       "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",
//   },
// };

// // var email = {
// //     from: "E-shop",
// //     to: options.email,
// //     subject: options.subject,
// //     Text: options.text,
// //   };

// const email = {
//   to: "mostafahamdy9988@gmail.com",
//   from: "roger@tacos.com",
//   subject: "Hi there",
//   text: "Awesome sauce",
//   html: "<b>Awesome sauce</b>",
// };

// const sendEmail = async (options) => {
//   const transport = nodeMailer.createTransport(sgTransport(sgTOptions));
//   await transport.sendMail({
//     to: "allahakbar00100@gmail.com",
//     from: "mostafahamdy9988@gmail.com",
//     subject: "tesssssssst",
//     html: "<h1><TEst/h1>",
//   });
// }; //endsendEmail

sendgrid.setApiKey(
  "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"
);

const sendEmail = ({ to, subject, message }) => {
  const msg = {
    to: to,
    from: "mostafahamdy9988@gmail.com",
    subject: subject,
    text: message,
    html: `<strong>${message}</strong>`,
  };
  return sendgrid.send(msg);
};

module.exports = sendEmail;
