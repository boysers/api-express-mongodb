const Thing = require("../models/Thing");

const jwt = require("jsonwebtoken");

exports.createThing = (req, res, next) => {
  delete req.body._id; // Supprime le faux id que génère le front-end pour le remplacer par l'id de mongoDB
  const thing = new Thing({
    ...req.body, // spread
  });
  thing
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyThing = (req, res, next) => {
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 */
exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id }).then((thing) => {
    if (!thing) {
      return res.status(404).json({ error: new Error("Objet non trouvé !") });
    }
    if (thing.userId !== req.auth.userId) {
      return res.status(401).json({
        error: new Error("Requête non autorisée !"),
      });
    }
    Thing.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: "Objet supprimé !" }))
      .catch((error) => res.status(400).json({ error }));
  });
};

exports.getOneThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.json(404).json({ error }));
};

exports.getAllThing = (req, res, next) => {
  Thing.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }));
};
