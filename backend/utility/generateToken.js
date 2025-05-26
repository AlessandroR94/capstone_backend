const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      nome: user.nome,
      cognome: user.cognome,
      isProfileComplete: user.isProfileComplete
    },
    process.env.JWT_SECRET,
    { expiresIn: '3d' }
  );
};

module.exports = generateToken;
