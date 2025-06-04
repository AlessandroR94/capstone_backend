const User = require('../models/User');
const generateToken = require('../utility/generateToken');
const sendEmail = require('../utility/sendEmail');


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


  // Età minima 16 anni 

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
      // Invio email di Benvenuto
      await sendEmail({
        to: user.email,
        subject: 'Benvenuto su GameBusters 🎮',
        html: `
      <h2>Ciao ${user.nome},</h2>
      <p>Grazie per esserti registrato su <strong>GameBusters</strong>!</p>
      <p>Ora puoi noleggiare giochi per Xbox, PlayStation e Nintendo.</p>
      <p>Buon divertimento! 🎉</p>
      <hr />
      <small>Non rispondere a questa email.</small>
    `
      });

      res.status(201).json({
        _id: user._id,
        username: user.username,
        nome: user.nome,
        cognome: user.cognome,
        email: user.email,
        token: generateToken(user)
      });
    } else {
      res.status(400).json({ message: 'Errore nella registrazione' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Errore del server' });
  }
};


const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        username: user.username,
        nome: user.nome,
        cognome: user.cognome,
        email: user.email,
        token: generateToken(user)
      });
    } else {
      res.status(401).json({ message: 'Email o password non corretti' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Errore del server' });
  }
};

const forgotUsername = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    await sendEmail({
      to: user.email,
      subject: 'Recupero username',
      html: `<p>Ciao ${user.nome}, il tuo username è: <strong>${user.username}</strong></p>`
    });

    res.json({ message: 'Email con username inviata' });
  } catch (err) {
    res.status(500).json({ message: 'Errore durante il recupero' });
  }
};

const crypto = require('crypto');

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 15;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await sendEmail({
      to: user.email,
      subject: 'Reimposta la tua password',
      html: `
        <p>Ciao ${user.nome},</p>
        <p>Clicca sul link per reimpostare la password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Scade tra 15 minuti.</p>
      `
    });

    res.json({ message: 'Email di reset inviata' });
  } catch (err) {
    res.status(500).json({ message: 'Errore durante il reset password' });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token non valido o scaduto' });
    }

    // Validazione nuova password
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: 'La nuova password deve avere almeno 8 caratteri, una lettera maiuscola e un numero'
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

await sendEmail({
  to: user.email,
  subject: 'Password modificata con successo',
  html: `
    <p>Ciao ${user.nome},</p>
    <p>La tua password è stata modificata correttamente.</p>
    <p>Se non sei stato tu, contattaci subito.</p>
  `
});

    res.json({ message: 'Password aggiornata con successo' });
  } catch (err) {
    res.status(500).json({ message: 'Errore durante il salvataggio della nuova password' });
  }
};


module.exports = { loginUser, registerUser, forgotUsername, forgotPassword, resetPassword };

