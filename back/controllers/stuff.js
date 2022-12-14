const Sauce = require('../models/thing');
const fs = require('fs');

exports.createThing = (req, res, next) => {

    const sauce = JSON.parse(req.body.sauce);
    
    const { name, manufacturer, description, mainPepper, imageUrl, heat} = sauce;
    console.log(sauce);

    const Newsauce = new Sauce({
        name,
        manufacturer,
        description,
        mainPepper,
        imageUrl,
        heat,
        likes : 0,
        dislikes: 0 ,
        usersLiked: [],
        usersDisliked: [],
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    Newsauce.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

exports.modifyThing = (req, res, next) => {
   
};

exports.deleteThing = (req, res, next) => {
   
};

exports.getOneThing = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
}

exports.getAllThing = (req, res, next) => {
    Sauce.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }));
}