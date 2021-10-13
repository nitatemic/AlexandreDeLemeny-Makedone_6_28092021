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
        imageUrl: `${req.protocol}://${req.get('host')}/public/sauces/images/${req.file.filename}`,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: "Sauce added!" }))
        .catch(error => res.status(400).json({ error }));
}

//Récupérer toutes les sauces de la base de données et les renvoyer à l'utilisateur dans un tableau
exports.getAllSauces = (req, res, next) => {    //TODO : Problème pour l'URL de l'image
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}