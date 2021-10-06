const express = require("express"); //ExpressJS module
const app = express();
require('dotenv').config();
const SECRET = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');
app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads

exports.checkMail = (req, res, next) => {
    if (!req.body.email.match(/^([a-z0-9]+(?:[._-][a-z0-9]+)*)@([a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,})$/i)) {
        console.log("Invalid mail");

        return res.status(400).json({
            error: "Invalid mail",
        });
    }
    next();
}



exports.checkToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, SECRET);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};
