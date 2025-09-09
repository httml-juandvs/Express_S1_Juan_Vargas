// db.js
const { MongoClient } = require('mongodb');

const uri = process.env.URI;
const client = new MongoClient(uri);

let db; // se llenará al conectar

async function connectDB() {
  if (db) return db;           // evita reconexiones
  await client.connect();
  db = client.db(process.env.DB_NAME);
  // Ping opcional para verificar conexión
  await db.command({ ping: 1 });
  console.log('✅ Conectado a MongoDB');
  return db;
}

function getDB() {
  if (!db) throw new Error('DB no inicializada. Llama connectDB() primero.');
  return db;
}

async function disconnectDB() {
  await client.close();
  console.log('👋 Conexión MongoDB cerrada');
}

module.exports = { connectDB, getDB, disconnectDB };
