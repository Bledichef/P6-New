const express = require("express");

const mongoose = require("mongoose");

const User = require("./models/User");
const userRoutes = require("./routes/user");

const app = express();

app.use(express.json());

mongoose

  .connect(
    "mongodb+srv://Guillaume:10@test.munwb.mongodb.net/test?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use((req, res, next) => {
  console.log("Requête reçue !");
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.json({ message: "Votre requête a bien été reçue !" });
  next();
});

app.use((req, res, next) => {
  console.log("Réponse envoyée avec succès !");
  next();
});

app.post("/api/auth/", (req, res, next) => {
  delete req.body._id;
  const UserSchema = new UserSchema({
    ...req.body,
  });
  UserSchema.save()
    .then(() => res.status(201).json({ message: "User enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
  next();
});

app.use("/api/auth/login", userRoutes);

module.exports = app;
