// ===========================
// ✅ Basic setup
// ===========================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


require('dotenv').config(); // If you use .env

const app = express();

// ===========================
// ✅ Middleware
// ===========================
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===========================
// ✅ MongoDB connection
// ===========================
const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ===========================
// ✅ Multer setup for file uploads
// ===========================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ===========================
// ✅ Mongoose schema
// ===========================
const PhotoSchema = new mongoose.Schema({
  filename: String,
  path: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Photo = mongoose.model('Photo', PhotoSchema);

// ===========================
// ✅ API routes
// ===========================

// Upload a photo
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  try {
    const photo = new Photo({
      filename: req.file.filename,
      path: req.file.path
    });
    await photo.save();
    res.status(201).json(photo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get all photos
app.get('/api/photos', async (req, res) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

// ===========================
// ✅ Dynamic port
// ===========================

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
