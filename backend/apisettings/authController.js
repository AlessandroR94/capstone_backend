const User = require('../models/User');
const generateToken = require('../utility/generateToken');

const registerUser = async (req, res) => {
  const { username, nome, cognome, dataDiNascita, email, password } = req.body;

  // Validazione EMAIL
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email non valida' });
  }

  // Validazione PASSWORD
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'La password deve avere almeno 8 caratteri, una lettera maiuscola e un numero'
    });
  }
  

  // Età minima 16 anni (Esiste un metodo di scrittura più raccolto? Chiedere ad Alessandro)
  
  const oggi = new Date();
  const dataNascita = new Date(dataDiNascita);
  const millisecondiInAnno = 1000 * 60 * 60 * 24 * 365.25;
  const eta = Math.floor((oggi - dataNascita) / millisecondiInAnno);

  if (eta < 16) {
    return res.status(400).json({ message: 'Devi avere almeno 16 anni per registrarti' });
  }

  try {
    const userExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: 'Email già registrata' });
    }

    if (usernameExists) {
      return res.status(400).json({ message: 'Username già in uso' });
    }

    const user = await User.create({
      username,
      nome,
      cognome,
      dataDiNascita,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        nome: user.nome,
        cognome: user.cognome,
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


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        username: user.username,
        nome: user.nome,
        cognome: user.cognome,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Email o password non corretti' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Errore del server' });
  }
};


module.exports = { loginUser, registerUser };

