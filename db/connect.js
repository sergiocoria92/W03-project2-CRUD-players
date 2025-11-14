const { MongoClient } = require('mongodb');

let _db;

const connectToServer = async (callback) => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI no está definido en .env');
    return callback('MONGODB_URI missing');
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();

    _db = client.db('cse341_W03_Project2');  // 👈 aquí tu DB

    console.log('✅ Conectado a MongoDB (cse341_W03_Project2)');
    callback();
  } catch (err) {
    console.error('❌ Error al conectar a MongoDB:', err);
    callback(err);
  }
};

const getDb = () => {
  if (!_db) throw Error('La base de datos no está inicializada');
  return _db;
};

module.exports = { connectToServer, getDb };
