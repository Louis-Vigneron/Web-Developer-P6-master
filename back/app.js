const express = require('express');

const app = express();
const mongoose = require('mongoose');

const stuffRoutes = require('./routes/stuff')
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://Louis:1234@cluster0.ozbeyw8.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use('/api/sauces', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;