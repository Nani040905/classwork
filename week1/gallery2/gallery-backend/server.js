require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

// Image model
const Image = mongoose.model('Image', {
  title: String,
  url: String,
  createdAt: { type: Date, default: Date.now }
})

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

// Routes
app.get('/api/images', async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 })
    res.json(images)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/images', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' })
    }

    const image = new Image({
      title: req.body.title,
      url: `http://localhost:5000/uploads/${req.file.filename}`
    })

    await image.save()
    res.status(201).json(image)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})