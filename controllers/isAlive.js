//Fonction qui renvoie le code 200 de réponse si le serveur est en marche
exports.isAlive = function(req, res) {
    res.status(200).send("Server is alive");
};