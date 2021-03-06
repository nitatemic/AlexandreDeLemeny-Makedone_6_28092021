const express = require("express"); //ExpressJS module
const userRoutes = require("./routes/user.js");
const sauceRoutes = require("./routes/sauce.js");
const isAliveRoutes = require("./routes/isAlive.js");
const path = require("path");
const helmet = require("helmet");
const app = express();
app.use(helmet());

app.use(express.urlencoded({extended: true}));
app.use(express.json()); // To parse the incoming requests with JSON payloads


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
app.use("/", isAliveRoutes);
app.use("/public", express.static(path.join(__dirname, "public")));

module.exports = app;
