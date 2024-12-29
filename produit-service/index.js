const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 4000;
const mongoose = require("mongoose");
const Produit = require("./Produit");

app.use(express.json());

mongoose.set('strictQuery', true);

mongoose.connect(
    "mongodb://localhost/produit-service",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(() => {
    console.log(`Produit-Service DB Connected`);
}).catch(error => {
    console.error(`Error connecting to database: ${error.message}`);
});

app.post("/produit/ajouter", (req, res, next) => {
const { nom, description, prix } = req.body;
const newProduit = new Produit({
nom,
description,
prix
});


newProduit.save() 
.then(produit => res.status(201).json(produit))
.catch(error => res.status(400).json({ error }));
});
app.get("/produit/acheter", (req, res, next) => {
const { ids } = req.body;
Produit.find({ _id: { $in: ids } })
.then(produits => res.status(201).json(produits))
.catch(error => res.status(400).json({ error }));
});
app.listen(PORT, () => {
console.log(`Product-Service at ${PORT}`);
});