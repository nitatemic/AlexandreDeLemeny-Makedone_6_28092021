const Sauce = require('../models/sauce');
const express = require("express"); //ExpressJS module
const app = express();

const mongoose = require("mongoose");
const User = require("../models/user");
require('dotenv').config();
const db = process.env.MONGO_URI;  //Variable pour l'URL de la BDD



mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('DB Connected')).catch(err => console.log(err));

//Ajouter une sauce à la base de données
exports.addSauce = function(req, res, next) {
    //Vérifier que toujours tous les champs sont remplis
    if(req.body.name && req.body.manufacturer && req.body.description && req.body.mainPepper && req.body.imageUrl && req.body.heat){
        //Recupérer l'id de l'image
        console.log(req)
        //Créer une sauce
        const sauceObject = new Sauce({
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            mainPepper: req.body.mainPepper,
            imageUrl: req.body.imageUrl,
            heat: req.body.heat,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: [],
            userId: req.body.userId
        });
        //Enregistrer la sauce dans la base de données
        sauceObject.save()
            .then(() => res.status(201).json({message: 'Sauce enregistrée !'}))
            .catch(error => res.status(400).json({error}));
    } else {
        res.status(400).json({error: 'Tous les champs doivent être remplis !'});
    }
}
