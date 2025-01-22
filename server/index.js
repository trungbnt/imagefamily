require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const uploadRoutes = require('./routes/upload');
const albumRoutes = require('./routes/albums');
const categoryRoutes = require('./routes/categories');
const path = require('path');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://imagefamily.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Thêm middleware để xử lý preflight requests
app.options('*', cors());

// Thêm middleware để xử lý static files
app.use(express.static(path.join(__dirname, '../client/build')));

app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/categories', categoryRoutes);

// Thêm route handler cho tất cả các requests không phải API
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 