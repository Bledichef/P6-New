const bcrypt = require("bcrypt");

const cryptojs = require("crypto-js");
const user = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
//const status = require("http-status");

/*exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new user({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
*/

exports.signup = (req, res, next) => {
  //chiffrer l'email avant de l'envoyer dans la base de données
  const emailCryptoJs = cryptojs
    .HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL}`)
    .toString();
  const SALT_NUMBER = 10;
  bcrypt
    .hash(req.body.password, SALT_NUMBER)
    .then((hash) => {
      const user = new user({
        email: emailCryptoJs,
        password: hash,
      });
      user
        .save()
        .then(() =>
          res
            .status(status.CREATED)
            .json({ message: "Utilisateur créé et sauvegardé" })
        )

        .catch((error) => res.status(status.BAD_REQUEST).json({ error }));
    })
    .catch((error) => res.status(status.INTERNAL_SERVER_ERROR).json({ error }));
};

exports.login = (req, res, next) => {
  exports.login = (req, res, next) => {
    const emailCryptoJs = cryptojs
      .HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL}`)
      .toString();
    user
      .findOne({ email: emailCryptoJs })

      .then((user) => {
        if (!user) {
          return res.status(401).json({ error: "Utilisateur non trouvé !" });
        }
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res
                .status(401)
                .json({ error: "Mot de passe incorrect !" });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
                expiresIn: "24h",
              }),
            });
          })
          .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  };
};
