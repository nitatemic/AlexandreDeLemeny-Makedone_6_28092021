const sauceCtrl = require('../controllers/sauce.js');
const express = require('express');
const authMiddleware = require('../middlewares/auth.js');
const multer = require('multer');

//Intercepter un fichier dans la requete est le stocker dans un dossier
//On utilise multer pour stocker le fichier dans le dossier saucePic
//On utilise multer pour filtrer les fichiers qui ne sont pas des images
const upload = multer({
    dest: './public/images/sauces',
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'));
        }
        cb(undefined, true);
    }
});


const router = express.Router();
//Route post qui recupere les données du formulaire et les envoie au controlleur pour les traiter
router.post('/',authMiddleware.verifyToken, upload.single('image'), sauceCtrl.addSauce);
router.get('/', sauceCtrl.getAllSauces);
router.get('/:id',authMiddleware.verifyToken, sauceCtrl.getOneSauce);
router.put('/:id', authMiddleware.verifyToken, upload.single('image'), sauceCtrl.modifySauce);
router.delete('/:id', authMiddleware.verifyToken, sauceCtrl.deleteSauce);
router.post('/:id/like', authMiddleware.verifyToken, sauceCtrl.changeLike);
module.exports = router;
