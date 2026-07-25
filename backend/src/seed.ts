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
      { name: 'Ammar', email: 'ammar@example.com', password: hashedPassword },
      { name: 'Alice', email: 'alice@example.com', password: hashedPassword },
      { name: 'Bob', email: 'bob@example.com', password: hashedPassword },
    ]);

    console.log(`Seeded ${users.length} users`);

    const now = Date.now();
    const ammar = users[0]._id;
    const alice = users[1]._id;
    const bob = users[2]._id;

    const tasks = [
      // Ammar's tasks — covers every feature
      { title: 'Design landing page', description: 'Create wireframes and mockups for the new landing page', status: 'in_progress', priority: 'high', dueDate: new Date(now + 3 * 86400000), user: ammar },
      { title: 'Fix login bug', description: 'Users cannot login with special characters in password', status: 'todo', priority: 'high', dueDate: new Date(now + 1 * 86400000), user: ammar },
      { title: 'Write unit tests', description: 'Add test coverage for auth module', status: 'done', priority: 'medium', dueDate: new Date(now - 2 * 86400000), user: ammar },
      { title: 'Update README', status: 'todo', priority: 'low', dueDate: new Date(now + 7 * 86400000), user: ammar },
      { title: 'Deploy to staging', status: 'in_progress', priority: 'high', dueDate: new Date(now + 1 * 86400000), user: ammar },
      { title: 'Refactor API routes', description: 'Split monolithic routes into feature-based modules', status: 'todo', priority: 'medium', user: ammar },
      { title: 'Set up CI/CD', description: 'GitHub Actions pipeline for automated testing and deployment', status: 'done', priority: 'medium', dueDate: new Date(now - 5 * 86400000), user: ammar },
      { title: 'Add dark mode', status: 'todo', priority: 'low', user: ammar },
      { title: 'Performance audit', description: 'Run Lighthouse audit and optimize bundle size', status: 'todo', priority: 'high', dueDate: new Date(now - 1 * 86400000), user: ammar },
      { title: 'User feedback survey', status: 'done', priority: 'low', dueDate: new Date(now - 10 * 86400000), user: ammar },

      // Alice's tasks
      { title: 'Prepare quarterly report', description: 'Compile Q3 metrics for board meeting', status: 'in_progress', priority: 'high', dueDate: new Date(now + 5 * 86400000), user: alice },
      { title: 'Review pull requests', status: 'todo', priority: 'medium', user: alice },
      { title: 'Update team calendar', status: 'done', priority: 'low', dueDate: new Date(now - 3 * 86400000), user: alice },
      { title: 'Draft API documentation', status: 'in_progress', priority: 'medium', dueDate: new Date(now + 10 * 86400000), user: alice },

      // Bob's tasks
      { title: 'Fix database connection pool', description: 'Connection timeout under high load', status: 'todo', priority: 'high', dueDate: new Date(now + 2 * 86400000), user: bob },
      { title: 'Upgrade dependencies', status: 'in_progress', priority: 'medium', user: bob },
      { title: 'Monitor server logs', status: 'done', priority: 'low', dueDate: new Date(now - 1 * 86400000), user: bob },
    ];

    await Task.insertMany(tasks);
    console.log(`Seeded ${tasks.length} tasks`);

    console.log('\n--- Credentials (all passwords: password123) ---');
    console.log('Ammar -> ammar@example.com');
    console.log('Alice -> alice@example.com');
    console.log('Bob   -> bob@example.com');
    console.log('-----------------------------------------------\n');
    console.log('Ammar has 10 tasks across all statuses, priorities, overdue, and missing dates.');
    console.log('Login with Ammar to see the full feature range.');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
