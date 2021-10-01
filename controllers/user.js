const User = require('../models/user');
const argon2 = require('argon2'); //Argon2 module (For password hashing)

const mongoose = require("mongoose");
require('dotenv').config();
const db = process.env.MONGO_URI;  //Variable pour l'URL de la BDD

mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('DB Connected')).catch(err => console.log(err));

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
