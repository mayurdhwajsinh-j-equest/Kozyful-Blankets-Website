// backend/seedAdmin.js
// Run once: node seedAdmin.js

const bcrypt = require('bcryptjs');
const db = require('../models');

const seedAdmin = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✓ Database connected');

    // Sync to make sure role column exists
    await db.sequelize.sync({ alter: true });
    console.log('✓ Database synced');

    const email = 'admin@kozyful.com';
    const password = 'Admin@1234';

    // Check if admin already exists
    const existing = await db.User.findOne({ where: { email } });
    if (existing) {
      // Update existing user to admin role
      await existing.update({ role: 'admin', isActive: true });
      console.log('✓ Existing user updated to admin role');
      console.log(`  Email   : ${email}`);
      console.log(`  Password: ${password}`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.User.create({
      name: 'Admin',
      email,
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    });

    console.log('✓ Admin user created successfully!');
    console.log(`  Email   : ${email}`);
    console.log(`  Password: ${password}`);
    console.log('\n  You can now log in at /login with these credentials.');
    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
