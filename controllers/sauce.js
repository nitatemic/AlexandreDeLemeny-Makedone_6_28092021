const Sauce = require('../models/sauce');
const express = require("express"); //ExpressJS module
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads

const mongoose = require("mongoose");
const User = require("../models/user");
require('dotenv').config();
const db = process.env.MONGO_URI;  //Variable pour l'URL de la BDD



mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('DB Connected')).catch(err => console.log(err));

//Ajouter une sauce à la base de données
exports.addSauce = (req, res, next) => {
    const sauceObj = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObj,
        likes: 0,
        dislikes: 0,
        imageUrl: `${req.protocol}://${req.get('host')}/sauces/images/${req.file.filename}`,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: "Sauce added!" }))
        .catch(error => res.status(400).json({ error }));
}

