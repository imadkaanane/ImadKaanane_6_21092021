const express = require ('express');
const mongoose = require('mongoose'); // Facilite les interactions avec la db
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require("helmet");
const cookieSession = require("cookie-session");

const app = express(); 

require('dotenv').config()  // Charge la variable d'environnement

host = process.env.HOST
profilName = process.env.USER;
mongoConnect = process.env.SECRET_DB;
cookieName = process.env.NAME_COOKIE;
secretCookie = process.env.SECRET_COOKIE;

mongoose.connect(`${mongoConnect}`,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`Connexion à MongoDB réussie avec le profil : ${profilName}!`))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
 
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }),
        helmet.crossOriginOpenerPolicy({ policy: "same-origin" }),
        helmet.crossOriginEmbedderPolicy({ policy: "require-corp" }),
        helmet.contentSecurityPolicy(),
        helmet.dnsPrefetchControl(),
        helmet.expectCt(),
        helmet.frameguard(),
        helmet.hidePoweredBy(),
        helmet.hsts(),
        helmet.ieNoOpen(),
        helmet.noSniff(),
        helmet.originAgentCluster(),
        helmet.permittedCrossDomainPolicies(),
        helmet.referrerPolicy(),
        helmet.xssFilter());

app.use(cookieSession({
  name :cookieName,
  secret: secretCookie,
  maxAge: 86400000, //24h
  secure: true,
  httpOnly: true,
  domain: host,
}))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use(bodyParser.json());

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes); 
app.use('/api/sauces', sauceRoutes); // Enregistrement du routeur pour toutes les demandes effectuées vers /api/sauces

module.exports = app;