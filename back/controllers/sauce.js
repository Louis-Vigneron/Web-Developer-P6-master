const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {

    const sauce = JSON.parse(req.body.sauce);
    delete sauce._id;

    const { userId, name, manufacturer, description, mainPepper, heat } = sauce;
    console.log(sauce);

    const Newsauce = new Sauce({

        userId,
        name,
        manufacturer,
        description,
        mainPepper,
        heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    Newsauce.save()
        .then(() => { res.status(201).json({ message: 'Sauce enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                if (req.file) {
                    const filename = sauce.imageUrl.split('/images/')[1];
                    console.log(filename);
                    fs.unlink(`images/${filename}`, (err) => { console.log(err) });
                }
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifié!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => { res.status(400).json({ error }) });
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé !' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}

exports.likeSauce = (req, res, next) => {
    const { like, userId } = req.body;

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {

            if (like === 1) {
                if (sauce.usersLiked.includes(userId) || sauce.usersDisliked.includes(userId)) return res.status(400).json({ message: 'Action non autorisée !' })
                sauce.usersLiked.push(userId);
                sauce.likes = sauce.usersLiked.length;
                res.status(200).json({ message: 'Score up !' });
            }

            if (like === -1) {
                if (sauce.usersDisliked.includes(userId) || sauce.usersLiked.includes(userId)) return res.status(400).json({ message: 'Action non autorisée !' })
                sauce.usersDisliked.push(userId);
                sauce.dislikes = sauce.usersDisliked.length;
                res.status(200).json({ message: 'Score down !' });
            }

            if (like === 0) {
                if (sauce.usersLiked.includes(userId)) {
                    sauce.usersLiked = sauce.usersLiked.filter(user => user !== userId)
                    sauce.likes = sauce.usersLiked.length;
                }
                if (sauce.usersDisliked.includes(userId)) {
                    sauce.usersDisliked = sauce.usersDisliked.filter(user => user !== userId)
                    sauce.dislikes = sauce.usersDisliked.length;
                }
                res.status(200).json({ message: 'Score neutre !' });
            }
            sauce.save()
        })
        .catch((error) => { res.status(400).json({ error }) });
}

