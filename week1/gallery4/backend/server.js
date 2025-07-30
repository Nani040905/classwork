// server.js

import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
// const Photo = require('D:\\mern\\clg\\week1\\gallery3\\backend\\models\\photo.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect('mongodb://localhost:27017/gallery')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PhotoSchema = new mongoose.Schema({
  title: String,
  url: String,
  favorite: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false }, // Soft delete
});
const Photo = mongoose.model('Photo', PhotoSchema);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Upload multiple photos
app.post('/photos/upload', upload.array('photos'), async (req, res) => {
  const photos = req.files.map(file => ({
    title: file.originalname,
    url: `http://localhost:5000/uploads/${file.filename}`,
  }));
  await Photo.insertMany(photos);
  res.json({ message: 'Uploaded' });
});

// Add photo via URL
app.post('/photos/add-url', async (req, res) => {
  const { url } = req.body;
  const photo = new Photo({ title: 'From URL', url });
  await photo.save();
  res.json(photo);
});

// Get all photos (excluding deleted)
app.get('/photos', async (req, res) => {
  const photos = await Photo.find({ deleted: false });
  res.json(photos);
});

// Delete photos (soft delete)
app.delete('/photos/:id', async (req, res) => {
  await Photo.findByIdAndUpdate(req.params.id, { deleted: true });
  res.json({ message: 'Deleted' });
});

// Bulk delete
app.post('/photos/delete-multiple', async (req, res) => {
  const { ids } = req.body;
  await Photo.updateMany({ _id: { $in: ids } }, { deleted: true });
  res.json({ message: 'Deleted multiple' });
});
// View trashed photos
app.get('/photos/trash', async (req, res) => {
  const photos = await Photo.find({ deleted: true });
  res.json(photos);
});

// Restore photo
app.post('/photos/restore/:id', async (req, res) => {
  await Photo.findByIdAndUpdate(req.params.id, { deleted: false });
  res.json({ message: 'Restored' });
});


app.listen(5000, () => console.log('Server running on port 5000'));

