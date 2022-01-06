const createRestaurant = require('../controllers/utils/createRestaurant.js');
const searchRestaurant = require('../controllers/utils/searchRestaurant.js');
const Restaurant = require('../models/restaurant.model.js');
const db = require('./db.js');

beforeAll(async () => await db.connect());

afterEach(async () => await db.clearDatabase());

afterAll(async () => await db.closeDatabase());

describe('Restaurants created when', () => {
  it('GET restaurant', async () => {
    const { restaurantId } = await createRestaurant(
      'First',
      'Turkey',
      5
    );

    const newRest = await Restaurant.findById(restaurantId);

    expect(newRest).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        location: expect.any(String),
        cost: expect.any(Number),
        rating: expect.any(Number),
      })
    );
    expect(newRest.name).toEqual('First');
    expect(newRest.name).toBeTruthy();
    expect(newRest.location).toBeTruthy();
    expect(newRest.location).toEqual('Turkey');
    expect(newRest.cost).toBeGreaterThan(0);
    expect(newRest.rating).toBeGreaterThanOrEqual(0);
    expect(newRest.rating).toBeLessThan(6);
    // done()
  });

  it('GET by searhing rests', async () => {
    await createRestaurant('First', 'Turkey', 95, 4);
    await createRestaurant('Second', 'Turkey', 175, 3);
    await createRestaurant('Third', 'Finn', 234, 2);
    await createRestaurant('Fourth', 'Finn', 647, 3);
    await createRestaurant('Fifth', 'Turkey', 158, 5);
    await createRestaurant('Sixth', 'England', 927, 1);
    const results = await searchRestaurant(
      null,
      null,
      null,
      null,
      'cost>550',
      'rating'
    );
    expect(results.length).toBeTruthy();
  });

  it('PUT restaurant', async () => {
    const { restaurantId } = await createRestaurant(
      'First',
      'Turkey',
      25,
      1
    );

    const newRest = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { name: 'Second' },
      { new: true, runValidators: true }
    );

    expect(newRest).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        location: expect.any(String),
        cost: expect.any(Number),
        rating: expect.any(Number),
      })
    );
    expect(newRest.name).toEqual('Second');
    expect(newRest.name).toBeTruthy();
    expect(newRest.location).toBeTruthy();
    expect(newRest.location).toEqual('Turkey');
    expect(newRest.cost).toBeGreaterThan(0);
    expect(newRest.rating).toBeGreaterThanOrEqual(0);
    expect(newRest.rating).toBeLessThan(6);
    // done()
  });

  it('DELETE restaurant', async () => {
    const { restaurantId } = await createRestaurant(
      'Second',
      'England',
      45,
      1
    );
    const newRest = await Restaurant.findByIdAndDelete(restaurantId);

    expect(newRest).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        location: expect.any(String),
        cost: expect.any(Number),
        rating: expect.any(Number),
      })
    );
    expect(newRest.name).toEqual('Second');
    expect(newRest.name).toBeTruthy();
    expect(newRest.location).toBeTruthy();
    expect(newRest.location).toEqual('England');
    expect(newRest.cost).toBeGreaterThan(0);
    expect(newRest.rating).toBeGreaterThanOrEqual(0);
    expect(newRest.rating).toBeLessThan(6);
  });
});
