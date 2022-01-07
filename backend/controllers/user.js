//bcrpyt permet un cryptage sécurisé
const bcrypt = require('bcrypt');
//jwt permet l'échange sécurisé de jetons (tokens)
const jwt = require('jsonwebtoken');
const Maskdata = require('maskdata');
const User = require('../models/user');
require('dotenv').config();
tokenSecret = process.env.TOKEN_SECRET;

// Creation fonctions signup et login
// Créer compte utilisateur
exports.signup = (req, res, next) => {
    
      bcrypt.hash(req.body.password, 10)
      .then(hash => {
          const user = new User({
              email: Maskdata.maskEmail2(req.body.email),
              password: hash
          });
          user.save()
              .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
              .catch( error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));

};

// Connexion à un compte utilisateur
exports.login = (req, res, next) => {
  User.findOne({ email: Maskdata.maskEmail2(req.body.email) })
      .then(user => {
          if(!user) {
              return res.status(401).json({ message: 'Utilisateur non trouvé !'});
          }
          bcrypt.compare(req.body.password, user.password)
              .then(valid => {
                  if (!valid) {
                      return res.status(401).json({ message: 'Mot de passe incorrect !'});
                  }
                  res.status(200).json({
                      userId: user._id,
                      token: jwt.sign(
                { userId: user._id },
                tokenSecret,
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };