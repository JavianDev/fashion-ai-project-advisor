require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.POSTGRES_DBNAME,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.DATABASE_PORT,
});

async function testConnection() {
  try {
    await client.connect();
    console.log('Successfully connected to the database!');
  } catch (err) {
    console.error('Failed to connect to the database:', err.message);
  } finally {
    await client.end();
  }
}

testConnection();
