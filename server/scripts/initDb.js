const mongoose = require('mongoose');
const Category = require('../models/Category');

const initDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'test'
    });

    // Tạo category mặc định nếu chưa có
    const defaultCategory = await Category.findOne({ name: 'Khác' });
    if (!defaultCategory) {
      await Category.create({
        name: 'Khác',
        order: 0,
        description: 'Danh mục mặc định'
      });
      console.log('Created default category');
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    mongoose.disconnect();
  }
};

initDatabase(); 