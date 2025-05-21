const express = require('express');
const router = express.Router();
const { updateUserProfile } = require('../apisettings/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

router.post(
  '/upload-profile',
  protect,
  upload.single('image'),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'Utente non trovato' });

      // Rimuovi immagine precedente se presente
      if (user.imageUrl && user.imageUrl.includes('cloudinary.com')) {
        const parts = user.imageUrl.split('/');
        const filename = parts[parts.length - 1];
        const publicId = 'profile_images/' + filename.split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Genera immagine ridimensionata
      const resizedImageUrl = req.file.path.replace('/upload/', '/upload/w_200,h_200,c_fill/');
      user.imageUrl = resizedImageUrl;
      await user.save();

      res.json({ message: 'Immagine aggiornata', imageUrl: user.imageUrl });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Errore durante l\'upload' });
    }
  }
);

router.delete('/delete-profile-image', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    if (user.imageUrl && user.imageUrl.includes('cloudinary.com')) {
      const parts = user.imageUrl.split('/');
      const filename = parts[parts.length - 1];
      const publicId = 'profile_images/' + filename.split('.')[0];

      await cloudinary.uploader.destroy(publicId);
    }

    user.imageUrl = '';
    await user.save();

    res.json({ message: 'Immagine profilo rimossa' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore durante la rimozione dell\'immagine' });
  }
});


module.exports = router;
