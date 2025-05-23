require('dotenv').config();
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const mysql = require('mysql2/promise');
const url = require('url');

const { DATABASE_URL } = process.env;

const parsedUrl = new url.URL(DATABASE_URL);

const pool = mysql.createPool({
  host: parsedUrl.hostname,
  user: parsedUrl.username,
  password: parsedUrl.password,
  database: parsedUrl.pathname.replace('/', ''),
  port: parsedUrl.port
});

module.exports = pool;
