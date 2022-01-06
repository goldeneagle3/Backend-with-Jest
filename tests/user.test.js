const createUser = require('../controllers/utils/createUser.js');
const User = require('../models/user.model.js');
const db = require('./db.js');

beforeAll(async () => await db.connect());

afterEach(async () => await db.clearDatabase());

afterAll(async () => await db.closeDatabase());

describe('Users created when', () => {
  it('GET user', async () => {
    const { userId } = await createUser(
      'First',
      'test@gmail.com',
      'jdhjwaawdwa'
    );

    const newUser = await User.findById(userId);

    expect(newUser).toEqual(
      expect.objectContaining({
        username: expect.any(String),
        email: expect.any(String),
        password: expect.any(String),
      })
    );
    expect(newUser.username).toEqual('First');
    expect(newUser.username).toBeTruthy();
    expect(newUser.username.length).toBeGreaterThan(3);
    expect(newUser.email).toEqual('test@gmail.com');
    expect(newUser.email).toContain('@');
    expect(newUser.password.length).toBeGreaterThan(8);
    // done()
  });

  it('PUT user', async () => {
    const { userId } = await createUser(
      'First',
      'test@gmail.com',
      'jdhjwaawdwa'
    );

    const newUser = await User.findByIdAndUpdate(
      userId,
      { username: 'Second' },
      { new: true, runValidators: true }
    );

    expect(newUser).toEqual(
      expect.objectContaining({
        username: expect.any(String),
        email: expect.any(String),
        password: expect.any(String),
      })
    );
    expect(newUser.username).toEqual('Second');
    expect(newUser.username).toBeTruthy();
    expect(newUser.username.length).toBeGreaterThan(3);
    expect(newUser.email).toEqual('test@gmail.com');
    expect(newUser.email).toContain('@');
    expect(newUser.password.length).toBeGreaterThan(8);
    // done()
  });

  it('DELETE user', async () => {
    const { userId } = await createUser(
      'Second',
      'test@gmail.com',
      'jdhjwaawdwa'
    );
    const newUser = await User.findByIdAndDelete(userId);
    expect(newUser).toEqual(
      expect.objectContaining({
        username: expect.any(String),
        email: expect.any(String),
        password: expect.any(String),
      })
    );
    expect(newUser.username).toEqual('Second');
    expect(newUser.username).toBeTruthy();
    expect(newUser.username.length).toBeGreaterThan(3);
    expect(newUser.email).toEqual('test@gmail.com');
    expect(newUser.email).toContain('@');
    expect(newUser.password.length).toBeGreaterThan(8);
  });
});
