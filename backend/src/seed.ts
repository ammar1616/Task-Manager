import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';
import Task from './models/Task';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Task.deleteMany({});

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const hashedPassword = await bcrypt.hash('password123', saltRounds);

    const users = await User.insertMany([
      { name: 'Alice', email: 'alice@example.com', password: hashedPassword },
      { name: 'Bob', email: 'bob@example.com', password: hashedPassword },
    ]);

    console.log(`Seeded ${users.length} users`);

    const statuses = ['todo', 'in_progress', 'done'] as const;
    const priorities = ['low', 'medium', 'high'] as const;
    const tasks = [];

    for (let i = 1; i <= 25; i++) {
      tasks.push({
        title: `Task ${i}`,
        description: `Description for task ${i}`,
        status: statuses[i % 3],
        priority: priorities[i % 3],
        dueDate: i % 3 === 0 ? new Date('2025-01-01') : new Date(Date.now() + i * 86400000),
        user: users[i % 2]._id,
      });
    }

    await Task.insertMany(tasks);
    console.log(`Seeded ${tasks.length} tasks`);

    console.log('Seed complete');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
