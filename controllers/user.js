const User = require('../models/user');
const argon2 = require('argon2'); //Argon2 module (For password hashing)

const express = require("express"); //ExpressJS module
const app = express();

const mongoose = require("mongoose");
require('dotenv').config();
const db = process.env.MONGO_URI;  //Variable pour l'URL de la BDD
const secret = process.env.SECRET_KEY;

mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('DB Connected')).catch(err => console.log(err));

/* ---------- Creation d'user ---------- */

exports.createUser = (req, res, next) => {
  let mail = req.body.email;
  let password = req.body.password;
  console.log(req.body);

  //Vérifier que les champs sont remplis
  if (!mail || !password) {
    console.log(req.body);
    res.status(400).json({
      error: "Missing mail or password"
    });
    return;
  }

  //Vérifier que le mail n'est pas déjà utilisé
  User.findOne({
    mail: mail
  }, function (err, user) {
    if (err) {
      console.log("Internal error :'(");
      res.status(500).json({
        error: "Internal error :'( "
      });
      return;
    }
    if (user) {
      console.log("Mail already used");
      res.status(400).json({
        error: "Mail already used"
      });
      return;
    }

    //Hachage du mot de passe
    console.log("Avant hash");
    argon2.hash(password).then(hash => {
      console.log("Après hash" + hash);
      //Création d'un nouvel utilisateur
      const newUser = new User({
        mail,
        passwordHash: hash
      });

      //Sauvegarder newUser dans la base de données grâce à Mongoose
      newUser.save().then(response =>
      {
        console.log(response);
        console.log("user created");
        res.status(201).json({
          message: "user created"
        });
      })
    });
  });
}

/* ---------- Fin creation d'user ---------- */


/* ---------- Login ----------*/

exports.login = (req, res, next) => {
  console.log(req.body);
  let mail = req.body.email;
  console.log("coucou");
  let password = req.body.password;
  console.log("coucou");
  console.log(req.body);

  //console.log(mail)
  //console.log(password)
  //Vérifier que les champs sont remplis
  if (!mail || !password) {
    console.log(req.body);
    res.status(400).json({
      error: "Missing mail or password"
    });
    return;
  }

  //Vérifier que le mail existe
  User.findOne({
    mail: mail
  }, function (err, user) {
    if (err) {
      console.log("Internal error :'(");
      res.status(500).json({
        error: "Internal error :'( "
      });
      return;
    }
    if (!user) {
      console.log("Mail doesn't exist");
      res.status(400).json({
        error: "Mail doesn't exist"
      });
      return;
    }

    //Vérifier que le mot de passe est correct
    argon2.verify(user.passwordHash, password).then(match => {
      if (!match) {
        console.log("Wrong password");
        res.status(400).json({
          error: "Wrong password"
        });
        return;
      }
      console.log("Login success");
      res.status(200).json({
        userId: user._id,
        token = jwt.sign({
          userId: user._id,
        }, secret, {
        expiresIn: "24h" }   //Expire dans 24h
      )
      });
      //Creer un token JWT pour l'utilisateur
    });
  });
};
