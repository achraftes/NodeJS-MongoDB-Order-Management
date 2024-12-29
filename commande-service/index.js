const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 4001;
const mongoose = require("mongoose");
const Commande = require("./Commande");
const axios = require('axios');

// Middleware pour vérifier l'authentification de l'utilisateur
const isAuthenticated = require("./isAuthenticated");

// Connexion à la base de données MongoDB
mongoose.set('strictQuery', true);

mongoose.connect(
    "mongodb://localhost/commande-service",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => {
    console.log(`Commande-Service DB Connected`);
}).catch(error => {
    console.error(`Error connecting to database: ${error.message}`);
});

app.use(express.json());

// Fonction pour calculer le prix total d'une commande
function prixTotal(produits) {
    let total = 0;
    for (let t = 0; t < produits.length; ++t) {
        total += produits[t].prix;
    }
    console.log("Prix total :" + total);
    return total;
}

// Fonction pour envoyer une requête HTTP au service produit et récupérer les détails des produits
async function httpRequest(ids) {
    try {
        const URL = "http://localhost:4000/produit/acheter"
        const response = await axios.post(URL, { ids: ids }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Route pour ajouter une commande avec vérification de l'authentification
app.post("/commande/ajouter", isAuthenticated, async (req, res, next) => {
    try {
        const { ids, email_utilisateur} = req.body;

    
        const produits = await httpRequest(ids);
        const prix_total = prixTotal(produits);

        // Création d'une nouvelle commande dans la collection commande 
        const newCommande = new Commande({
            produits: ids,
            email_utilisateur: email_utilisateur,
            prix_total: prix_total,
        });

        // Enregistrer la commande dans la base de données
        const commande = await newCommande.save();
        res.status(201).json(commande);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout de la commande." });
    }
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
