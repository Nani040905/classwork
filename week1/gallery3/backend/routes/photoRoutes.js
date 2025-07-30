const express = require('express');
const router = express.Router();
const Photo = require('D:\\mern\\clg\\week1\\gallery3\\backend\\models\\photo.js');

// GET all photos
router.get('/', async (req, res) => {
  try {
    const photos = await Photo.find();
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new photo
router.post('/', async (req, res) => {
  const { title, imageUrl, description } = req.body;

  const newPhoto = new Photo({
    title,
    imageUrl,
    description
  });

  try {
    const savedPhoto = await newPhoto.save();
    res.status(201).json(savedPhoto);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
