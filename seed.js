const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seed() {
  try {
    const hashedPassword = await bcrypt.hash('admin@123', 10); // Hash password
    await prisma.user.create({
      data: {
        name: 'admin01',
        password: hashedPassword,
        username: 'Admin User',
        isAdmin: "true",
      }
    });
    console.log('Admin user created');
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();