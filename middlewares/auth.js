exports.checkMail = (req, res, next) => {
    if (!req.body.email.match(/^([a-z0-9]+(?:[._-][a-z0-9]+)*)@([a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,})$/i)) {
        console.log("Invalid mail");

        return res.status(400).json({
            error: "Invalid mail",
        });
    }
    next();
}
