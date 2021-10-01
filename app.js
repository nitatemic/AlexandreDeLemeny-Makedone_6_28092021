const express = require("express"); //ExpressJS module
const userRoutes = require("./routes/user.js")
const userCtrl = require('./controllers/user.js')
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

//Hachage du mot de passe de l'utilisateur, ajout de l'utilisateur à la base de données
app.use("/api/auth", userRoutes);

module.exports = app;
