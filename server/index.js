require('dotenv').config(); // 🚨 Nên bỏ trong môi trường production
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// CORS configuration - Nên hạn chế origin
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-render-url.onrender.com' 
    : '*'
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB - Thêm useCreateIndex
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true, // 👈 Thêm dòng này
  dbName: 'test'
})
.then(() => console.log('Connected to MongoDB - Database: test'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// API routes
app.use('/api/categories', require('./routes/categories'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/albums', require('./routes/albums'));

// Serve static files - Kiểm tra lại đường dẫn
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, 'client/build'); // 👈 Điều chỉnh đường dẫn
  app.use(express.static(clientPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => { // 👈 Khai báo server
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});