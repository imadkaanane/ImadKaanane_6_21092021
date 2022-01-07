const Sauce = require('../models/sauce');
const fs = require('fs');

// Creation de la Sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    console.log(req.file.filename);
    delete sauceObject._id;
    // Creation d'une nouvelle instance du modèle Sauce
    const sauce = new Sauce({
      ...sauceObject,
      // Génère url de l'image
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: '',
      usersDisliked: ''
    });
    sauce.save()// Enregistre dans la db l'objet et renvoie une promesse
      .then(() => res.status(201).json({ message: 'Nouvelle sauce enregistrée !'}))
      .catch(error => res.status(403).json({ error }));
};

// Modifier la Sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce), // Récupération de toutes les infos sur l'objet
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

// Suppression Sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};


// Get specific Sauce (id)
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id }) // Methode pour trouver une sauce unique
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

// Get all Sauces in database
exports.getAllSauces = (req, res, next) => {
    Sauce.find() // Methode renvoie un tableau contenant toutes les sauces dans la base de données
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};

// Like Or Dislike 
// Un seul like ou dislike par user 
exports.likeOrNot = (req, res, next) => {
	const like = req.body.like
	const userId = req.body.userId
	const sauceId = req.params.id

	switch (like) {
		case 1:
			Sauce.updateOne(
				{_id: sauceId},
				{
					$inc: {likes: 1},
					$push: {usersLiked: userId},
					_id: sauceId,
				}
			)
				.then(() => res.status(200).json({message: "Like ajouté à la sauce !"}))
				.catch((error) => res.status(400).json({error}))
			break

		case -1:
			Sauce.updateOne(
				{_id: sauceId},
				{
					$inc: {dislikes: 1},
					$push: {usersDisliked: userId},
					_id: sauceId,
				}
			)
				.then(() => res.status(200).json({message: "Dislike ajouté à la sauce !"}))
				.catch((error) => res.status(400).json({error}))
			break

		case 0:
			Sauce.findOne({_id: sauceId})
				.then((sauce) => {
					if (sauce.usersLiked.includes(userId)) {
						Sauce.updateOne(
							{_id: sauceId},
							{
								$pull: {usersLiked: userId},
								$inc: {likes: -1},
								id: sauceId,
							}
						)
							.then(() => res.status(200).json({message: "Like retiré de la sauce !"}))
							.catch((error) => res.status(400).json({error}))
					}
					if (sauce.usersDisliked.includes(userId)) {
						Sauce.updateOne(
							{_id: sauceId},
							{
								$pull: {usersDisliked: userId},
								$inc: {dislikes: -1},
								id: sauceId,
							}
						)
							.then(() => res.status(200).json({message: "Dislike retiré de la sauce !"}))
							.catch((error) => res.status(400).json({error}))
					}
				})
				.catch((error) => res.status(404).json({error}))
			break
	}
}