const db = require('../mock.data.js');

describe('Restaurant API', () => {
  it('GET list all restaurants', () => {
    expect(db.length).toBe(6);
    db.map((i) => {
      expect(i).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          location: expect.any(String),
          cost: expect.any(Number),
          rating: expect.any(Number),
        })
      );
    });
  });

  it('PATCH objects in array of restaurants', () => {
    let turkos = db.filter((i) => i.location === 'Turkey');
    let changed = turkos.map((i) => {
      i.location = 'Finn';
      i.rating = 5;
      return i;
    });
    expect(changed).toBeTruthy();
    expect(changed.length).toBe(4);
    expect(changed.length).toBeLessThan(5);
    changed.map((i) => {
      expect(i.rating).toBeLessThan(6);
    });
  });

  it('POST AND GET a restarant', () => {
    const data = {
      id: 7,
      name: 'Restaurant 1',
      location: 'New Zelland',
      cost: 20,
      rating: 1,
    };

    const addDta = db.push(data);

    db.map((i) => {
      if (i.name === 'Restaurant 1') {
        expect(i.name).toBeTruthy();
        expect(i.name).toBe('Restaurant 1');
        expect(i.location).toBeTruthy();
        expect(i.location).toBe('New Zelland');
        expect(i.cost).toBeGreaterThan(0);
        expect(i.cost).toBeTruthy();
        expect(i.rating).toBeGreaterThan(0);
        expect(i.rating).toBeLessThan(6);
      }
    });
    expect(addDta).toBeTruthy();
    expect(db.length).toBe(7);
  });

  it('PATCH a restaurant', () => {
    let restaurant = db.find((i) => i.name === 'Restaurant 1');
    expect(restaurant).toBeTruthy();
    expect(restaurant.location).toBe('New Zelland');

    restaurant.location = 'New Zealand';

    expect(restaurant.name).toBeTruthy();
    expect(restaurant.name).toBe('Restaurant 1');
    expect(restaurant.location).toBeTruthy();
    expect(restaurant.location).toBe('New Zealand');
    expect(db.length).toBe(7);
    expect(restaurant.cost).toBeGreaterThan(0);
    expect(restaurant.cost).toBeTruthy();
    expect(restaurant.rating).toBeGreaterThan(0);
    expect(restaurant.rating).toBeLessThan(6);
  });

  it('DELETE a restaurant', () => {
    const restaurant = db.find((i) => i.name === 'Restaurant 1');
    expect(restaurant).toBeTruthy();
    expect(restaurant.location).toBe('New Zealand');

    const deleteElem = db.filter((i) => {
      return i.name !== restaurant.name;
    });
    let isCheck = deleteElem.find((i) => i.name === restaurant.name);

    expect(deleteElem).toBeTruthy();
    expect(deleteElem.length).toBe(6);
    expect(isCheck).not.toBe('Restaurant 1');
  });
});
