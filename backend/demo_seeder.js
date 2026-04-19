const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: './backend/.env' });

// Use the existing model to ensure we follow the schema exactly
const User = require('./backend/models/User.model');

async function createDemoUsers() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/equization';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    const demoUsers = [
      { username: 'khaled_99', email: 'khaled@demo.com', password: 'Password123!', role: 'user', isVerified: true },
      { username: 'fatima_quiz', email: 'fatima@demo.com', password: 'Password123!', role: 'user', isVerified: true },
      { username: 'ahmed_teacher', email: 'ahmed@teacher.com', password: 'Password123!', role: 'user', isVerified: true },
      { username: 'ali_student', email: 'ali@student.com', password: 'Password123!', role: 'user', isVerified: true }
    ];

    for (const u of demoUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        // Password hashing is handled by pre-save hook in the model
        await User.create(u);
        console.log(`👤 Created user: ${u.username} (${u.email})`);
      } else {
        console.log(`ℹ️ User ${u.email} already exists`);
      }
    }

    console.log('✨ All demo users are ready!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createDemoUsers();
