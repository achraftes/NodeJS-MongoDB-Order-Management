const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 4002;
const mongoose = require("mongoose");
const Utilisateur = require("./utilisateur");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

mongoose.connect("mongodb://localhost/auth-service", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log(`Commande-Service DB Connected`);
})
.catch((err) => {
  console.error('Erreur de connexion à la base de données d\'Auth-Service :', err);
});

app.use(express.json());

// La méthode register permettra de créer et d'ajouter un nouvel utilisateur à la base de données
app.post("/auth/register", async (req, res) => {
  let { nom, email, mot_passe } = req.body;
  // On vérifie si le nouvel utilisateur est déjà inscrit avec la même adresse email ou pas
  const userExists = await Utilisateur.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Cet utilisateur existe déjà" });
  } else {
    bcrypt.hash(mot_passe, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: err });
      } else {
        mot_passe = hash;
        const newUtilisateur = new Utilisateur({ nom, email, mot_passe });
        newUtilisateur.save()
        .then(user => res.status(201).json(user))
        .catch(error => res.status(400).json({ error }));
      }
    });
  }
});

// La méthode login permettra de retourner un token après vérification de l'email et du mot de passe
app.post("/auth/login", async (req, res) => {
  const { email, mot_passe } = req.body;
  const utilisateur = await Utilisateur.findOne({ email });
  if (!utilisateur) {
    return res.status(404).json({ message: "Utilisateur introuvable" });
  } else {
    bcrypt.compare(mot_passe, utilisateur.mot_passe).then(resultat => {
      if (!resultat) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      } else {
        const payload = { email, nom: utilisateur.nom };
        jwt.sign(payload, "secret", (err, token) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Erreur lors de la génération du token" });
          }
          return res.json({ token });
        });
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`Auth-Service démarré sur le port ${PORT}`);
});
