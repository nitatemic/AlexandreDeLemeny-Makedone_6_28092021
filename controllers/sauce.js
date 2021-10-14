const Sauce = require('../models/sauce');
const express = require("express"); //ExpressJS module
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads

const mongoose = require("mongoose");
const User = require("../models/user");
require('dotenv').config();
const db = process.env.MONGO_URI;  //Variable pour l'URL de la BDD



mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => ).catch(err => );

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

//Supprimer l'entrée de la sauce dans la base de données et renvoyer la validation
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {    //TODO : Supprimer la photo de la sauce
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce deleted!' }))
                    .catch(error => res.status(400).json({ error }));
            });
}

exports.changeLike = (req, res, next) => {
    
    
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {

            switch(req.body.like) {
                case 1:
                    sauce.likes += 1;
                    sauce.usersLiked.push(req.body.userId);
                    break;
                case -1:
                    sauce.dislikes += 1;
                    sauce.usersDisliked.push(req.body.userId);
                    break;
                case 0:
                    if(sauce.usersLiked.includes(req.body.userId)) {
                        sauce.likes -= 1;
                        sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId), 1);
                    }
                    if(sauce.usersDisliked.includes(req.body.userId)) {
                        sauce.dislikes -= 1;
                        sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId), 1);
                    }
                    break;
            }
            sauce.save()
                .then(() => res.status(201).json({ message: "Like changed!" }))
                .catch(error => res.status(400).json({ error }))
        });
}

//Met à jours la sauce
exports.modifySauce = (req, res, next) => {
    //Si l'utilisateur a envoyé une image
    if(req.file) {
        const sauceObj = JSON.parse(req.body.sauce);
        
        Sauce.updateOne({ _id: req.params.id }, {
            ...sauceObj,
            imageUrl: `${req.protocol}://${req.get('host')}/public/sauces/images/${req.file.filename}`
        })
            .then(() => res.status(201).json({ message: "Sauce modified!" }))
            .catch(error => res.status(400).json({ error }));
    } else {
        Sauce.updateOne({ _id: req.params.id }, {
            name : req.body.name,
            manufacturer : req.body.manufacturer,
            mainPepper : req.body.mainPepper,
            heat : req.body.heat,
            description : req.body.description
        })
            .then(() => res.status(201).json({ message: "Sauce modified!" }))
            .catch(error => res.status(400).json({ error }));
    }
}
