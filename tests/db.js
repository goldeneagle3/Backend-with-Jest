const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
// import mongoose from 'mongoose'
// import { MongoMemoryServer } from "mongodb-memory-server"

let mongod = undefined;

// connect to db
module.exports.connect = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  const mongooseOpt = {
    dbName: 'verifyMaster',
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  };
  await mongoose.connect(uri, mongooseOpt);
};

// disconnect and close connection
module.exports.closeDatabase = async () => {
  if (mongod) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  }
};

// clear the db, remove all data
module.exports.clearDatabase = async () => {
  if (mongod) {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  }
};
