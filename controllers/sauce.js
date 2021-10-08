const Sauce = require('../models/sauce');

const express = require("express"); //ExpressJS module
const app = express();

const mongoose = require("mongoose");
require('dotenv').config();
const db = process.env.MONGO_URI;  //Variable pour l'URL de la BDD

mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('DB Connected')).catch(err => console.log(err));

/* ---------- Login ----------*/

exports.arraySauces = (req, res, next) => {

};
