const { MongoClient } = require('mongodb');

let _db;

const connectToServer = async (callback) => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in .env');
    return callback('MONGODB_URI missing');
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();

    _db = client.db('cse341_W03_Project2');  // 👈 your DB here

    console.log('✅ Connected to MongoDB (cse341_W03_Project2)');
    callback();
  } catch (err) {
    console.error('❌ Error connecting to MongoDB:', err);
    callback(err);
  }
};

const getDb = () => {
  if (!_db) throw Error('Database is not initialized');
  return _db;
};

module.exports = { connectToServer, getDb };
