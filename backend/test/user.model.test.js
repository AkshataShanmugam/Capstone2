const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User'); // Path to your User model

let mongoServer;

// Setup Mongo in-memory database
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Cleanup after tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User Model Tests', () => {
  it('should create a new user with valid data', async () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      provider: 'local'
    });

    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe('testuser');
    expect(savedUser.email).toBe('test@example.com');
  });

  it('should fail if email is not unique', async () => {
    const user1 = new User({
      username: 'user1',
      email: 'unique@example.com',
      password: 'password123',
      provider: 'local'
    });
    await user1.save();

    const user2 = new User({
      username: 'user2',
      email: 'unique@example.com',
      password: 'password456',
      provider: 'local'
    });

    try {
      await user2.save();
    } catch (error) {
      expect(error.code).toBe(11000); // MongoDB duplicate key error code
    }
  });

  it('should fail if username is missing when provider is local', async () => {
    const user = new User({
      email: 'test@example.com',
      password: 'password123',
      provider: 'local'
    });

    try {
      await user.save();
    } catch (error) {
      expect(error.errors.username).toBeDefined();
    }
  });

  it('should fail if password is missing when provider is local', async () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      provider: 'local'
    });

    try {
      await user.save();
    } catch (error) {
      expect(error.errors.password).toBeDefined();
    }
  });

  it('should pass if provider is google and no username or password is provided', async () => {
    const user = new User({
      email: 'test@example.com',
      provider: 'google'
    });

    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe('test@example.com');
    expect(savedUser.provider).toBe('google');
    expect(savedUser.username).toBeUndefined();
    expect(savedUser.password).toBeUndefined();
  });
});
