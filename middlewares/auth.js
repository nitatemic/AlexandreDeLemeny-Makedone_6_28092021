const express = require("express"); //ExpressJS module
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads
require('dotenv').config();
const SECRET = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");


exports.checkMail = (req, res, next) => {
    if (!req.body.email.match(/^([a-z0-9]+(?:[._-][a-z0-9]+)*)@([a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,})$/i)) {
        console.log("Invalid mail");

        return res.status(400).json({
            error: "Invalid mail",
        });
    }
    next();
}

//Vérifier que le token est valide
exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({
            error: "You must be logged in to access this resource",
        });
    }
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            console.log("Nooooon")
            return res.status(401).json({
                error: "You must be logged in to access this resource",
            });
        }
        req.user = decoded;
        next();
    });
}
