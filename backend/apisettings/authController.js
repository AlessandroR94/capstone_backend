const User = require('../models/User');
const generateToken = require('../utility/generateToken');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      return res.status(401).json({ message: 'Email o password non corretti' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Errore del server' });
  }
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Utente già esistente' });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Errore nella registrazione' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Errore del server' });
  }
};

module.exports = { loginUser, registerUser };

