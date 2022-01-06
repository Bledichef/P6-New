const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: process.env.SMTPPATH,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAILENVOI,
    pass: process.env.EMAILPASSWORD,
  },
});
const appliFullRequest = {
  from: process.env.EMAILENVOI,
  to: process.env.EMAILDESTINATAIRE,
  subject: "Attention danger sur l'application",
  text: "Un utilisateur a effectué 50 requêtes en 15min sur l'application,  danger pour la sécurité de l'application",
};
