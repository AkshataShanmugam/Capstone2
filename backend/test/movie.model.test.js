const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Movie = require('../models/Movie'); // Path to your Movie model

let mongoServer;

// Setup Mongo in-memory database before all tests
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

describe('Movie Model Tests', () => {
  it('should create a new movie with valid data', async () => {
    const movie = new Movie({
      title: 'Inception',
      genre: 'Sci-Fi',
      releaseDate: new Date('2010-07-16'),
      rating: 8.8,
    });

    const savedMovie = await movie.save();
    expect(savedMovie._id).toBeDefined();
    expect(savedMovie.title).toBe('Inception');
    expect(savedMovie.genre).toBe('Sci-Fi');
    expect(savedMovie.releaseDate).toEqual(new Date('2010-07-16'));
    expect(savedMovie.rating).toBe(8.8);
  });

  it('should fail to create a movie if the title is missing', async () => {
    const movie = new Movie({
      genre: 'Drama',
      releaseDate: new Date('2000-01-01'),
      rating: 7.5,
    });

    try {
      await movie.save();
    } catch (error) {
      expect(error.errors.title).toBeDefined();
    }
  });

  it('should fail to create a movie if the genre is missing', async () => {
    const movie = new Movie({
      title: 'Titanic',
      releaseDate: new Date('1997-12-19'),
      rating: 7.8,
    });

    try {
      await movie.save();
    } catch (error) {
      expect(error.errors.genre).toBeDefined();
    }
  });

  it('should fail to create a movie if the rating is not a number', async () => {
    const movie = new Movie({
      title: 'Avatar',
      genre: 'Action',
      releaseDate: new Date('2009-12-18'),
      rating: 'not a number', // Invalid rating type
    });

    try {
      await movie.save();
    } catch (error) {
      expect(error.errors.rating).toBeDefined();
    }
  });

  it('should create a movie with a valid rating', async () => {
    const movie = new Movie({
      title: 'The Dark Knight',
      genre: 'Action',
      releaseDate: new Date('2008-07-18'),
      rating: 9.0,
    });

    const savedMovie = await movie.save();
    expect(savedMovie.rating).toBe(9.0);
  });

  it('should handle optional fields correctly (e.g., releaseDate)', async () => {
    const movie = new Movie({
      title: 'Untitled Movie',
      genre: 'Comedy',
      rating: 6.5,
    });

    const savedMovie = await movie.save();
    expect(savedMovie.releaseDate).toBeUndefined(); // releaseDate is optional
  });
});
