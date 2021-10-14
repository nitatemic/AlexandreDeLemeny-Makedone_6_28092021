const User = require('../models/user');
const argon2 = require('argon2'); //Argon2 module (For password hashing)
const jwt = require("jsonwebtoken");
const express = require("express"); //ExpressJS module
const app = express();

const mongoose = require("mongoose");
require('dotenv').config();
const db = process.env.MONGO_URI;  //Variable pour l'URL de la BDD
const secret = process.env.SECRET_KEY;

mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => ).catch(err => );

/* ---------- Creation d'user ---------- */

exports.createUser = (req, res, next) => {
  let mail = req.body.email;
  let password = req.body.password;
  

  //Vérifier que les champs sont remplis
  if (!mail || !password) {
    
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
      
      res.status(500).json({
        error: "Internal error :'( "
      });
      return;
    }
    if (user) {
      
      res.status(400).json({
        error: "Mail already used"
      });
      return;
    }

    //Hachage du mot de passe
    
    argon2.hash(password).then(hash => {
      
      //Création d'un nouvel utilisateur
      const newUser = new User({
        mail,
        passwordHash: hash
      });

      //Sauvegarder newUser dans la base de données grâce à Mongoose
      newUser.save().then(response =>
      {
        
        
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
  //Vérifier que les champs sont remplis
  if (!req.body.email || !req.body.password) {
    
    res.status(400).json({
      error: "Missing mail or password"
    });
    return;
  }

  //Vérifier que le mail existe
  User.findOne({
    mail: req.body.email
  }, function (err, user) {
    if (err) {
      
      res.status(500).json({
        error: "Internal error :'( "
      });
      return;
    }
    if (!user) {
      
      res.status(400).json({
        error: "Mail doesn't exist"
      });
      return;
    }

    //Vérifier que le mot de passe est correct
    argon2.verify(user.passwordHash, req.body.password).then(match => {
      if (!match) {
        
        res.status(400).json({
          error: "Wrong password"
        });
        return;
      }
      
      res.status(200).json(
        {userId: user._id,
          token: jwt.sign({
            userId: user._id,
          }, secret, {
            expiresIn: "12h"
          })
        });
    });
  });
};
