const express = require("express"); //ExpressJS module
const mongoose = require("mongoose");

require('dotenv').config();
const db = process.env.MONGO_URI;  //Variable pour l'URL de la BDD

mongoose.connect(db,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('DB Connected'))
  .catch(err => console.log(err));

const argon2 = require('argon2'); //Argon2 module (For password hashing)
const User = require('./models/User');

const app = express();

//Ajouter une route POST pour créer un nouvel utilisateur et renvoyer un message de confirmation
//Données récupérés : mail et password.
//Hachage du mot de passe de l'utilisateur, ajout de l'utilisateur à la base de données
app.post("/api/auth/signup", function (req, res) {
  //Parser le body de la requête
  const {mail, password} = req.body;
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
        error: "Internal error"
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
      const user = new User({
        mail,
        password: hash
      });
      //Sauvegarde de l'utilisateur dans la base de données
      user.save().then(() => {
        res.send("Utilisateur créé");
      }).catch(err => {
        res.status(500).send(err);
      });
    });
  });
});


module.exports = app;
