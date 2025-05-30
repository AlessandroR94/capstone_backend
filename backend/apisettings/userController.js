const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      _id: user._id,
      username: user.username,
      nome: user.nome,
      cognome: user.cognome,
      email: user.email,
      isAdmin: user.isAdmin,
      isProfileComplete: user.isProfileComplete,
      token
    });
  } catch (err) {
    console.error('Errore nel login:', err);
    res.status(500).json({ message: 'Errore durante il login' });
  }
};

const updateUserProfile = async (req, res) => {
  const { username, nome, cognome, dataDiNascita } = req.body;

  try {
    // Controlla se username è già in uso da altri
    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
        return res.status(400).json({ message: 'Username già in uso' });
      }
    }

    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    user.username = username || user.username;
    user.nome = nome || user.nome;
    user.cognome = cognome || user.cognome;
    user.dataDiNascita = dataDiNascita || user.dataDiNascita;
    user.isProfileComplete = true;

    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      nome: user.nome,
      cognome: user.cognome,
      email: user.email,
      isProfileComplete: user.isProfileComplete
    });
  } catch (err) {
    res.status(500).json({ message: 'Errore durante l\'aggiornamento del profilo' });
  }
};

module.exports = {
  updateUserProfile,
  loginUser
};
