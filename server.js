const jwt = require('jsonwebtoken');
require('dotenv').config();
if (!process.env.JWT_SECRET_KEY) {
  console.log("ERREUR: vous devez créer une variable d'env JWT_SECRET_KEY");
  process.exit(1);
}
console.log('Reading JWT_SECRET_KEY');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const bcrypt = require('bcrypt');
const express = require('express');
const app = express();

async function hashIt(password){
  const salt = await bcrypt.genSalt(6);
  const hashed = await bcrypt.hash(password, salt);
}

/*
 *           B D D
 */
const Tache = require('Tache');
const User = require('User');
// const Cruds = new Collection("Cruds"); // une ressource CRUD générique, ex: Todos, items d'une liste de courses, etc...



/*
 * PRE-POPULER LA BASE DE DONNES POUR VERIFIER QUE CA FONCTIONNE
 * (juste pour des raisons pédagogiques, en vrai ne pas mettre les trucs en dessous.
 */

/* on va mettre des trucs en BDD pour bien séparer la logique d'Auth de la logique de Signin */

User.memoryDb.set(0, {email: "mail@mail.com", username: "admin", motdepasse: true});
// associated token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjUxODM2Njg3fQ.sYo75qkwzZMu7MrivJ85XjK0uOwdSHx4kurazvTkThg , associated key : 12345678

User.memoryDb.set(1, {email: "newmail@mail.com", username: "local", motdepasse: false});
// associated token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MCwiaWF0IjoxNjUxODM2Njg3fQ.AyilbQC2-Bu1f_X0SUIQ72_agVBQMxaeg0nQLB0xVrI , associated key : 12345678
User.id = 2; //





/* Logique d'authentification */
function authGuard(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({erreur: "Vous devez vous connecter"})

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded;
    // Le middleware a fait son boulot et peut laisser la place au suivant.
    next();
  } catch (exc) {
    return res.status(400).json({erreur: "Token Invalid"})
  }
}

app.get('/', (req, res) => {
  res.status(200).json({message: "Hello World"});
})

// ne pas laisser la possibilité de requêter un compte spécifique.
app.get('/moncompte', [authGuard], (req, res) => {
  const user = User.getOne(req.user.id)

  delete user.password; // on ne veut pas transmettre le Hash.

  res.status(200).send({user});
})


// Route réservée aux admins
app.get('/compte/:id', [authGuard], (req, res) => {


  // ROLE BASED ACCESS
  const whoami = User.getOne(req.user.id)
  if (!whoami.isAdmin) return res.status(403).json({erreur: "Vous n'avez pas le droit d'accéder à ça"})


  const user = User.getOne(parseInt(req.params.id))
  delete user.password; // on ne veut pas transmettre le Hash.

  res.status(200).send({user});
})


// si jest run, ne pas listen...
if (process.env.NODE_ENV !== "test"){
  app.listen(3000);
}

module.exports = app;

app.listen(port);
console.log('Server started at http://localhost:' + port);
