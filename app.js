const express = require("express"); //ExpressJS module
const mongoose = require("mongoose");
let bodyParser = require("body-parser");

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

//Middleware
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded




app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});




//Ajouter une route POST pour créer un nouvel utilisateur et renvoyer un message de confirmation
//Données récupérés : mail et password.
//Hachage du mot de passe de l'utilisateur, ajout de l'utilisateur à la base de données
app.post("/api/auth/signup", function (req, res) {

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

  //Vérifier que l'adresse mail est bien une adresse mail
  if (!mail.match(/^([a-z0-9]+(?:[._-][a-z0-9]+)*)@([a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,})$/i)) {
    console.log("Invalid mail");
    res.status(400).json({
      error: "Invalid mail",
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
        password: hash
      });

      //Sauvegarder newUser dans la base de données grâce à Mongoose
      newUser.save(function (err) {
        if (err) {
          console.log("Internal error :'(");
          res.status(500).json({
            error: "Oh, nooo... Internal error :'( "
          });
          return;
        }
        console.log("User created");
        res.status(201).json({
          message: "User created"
        });
      });
    });
  });
});

module.exports = app;
