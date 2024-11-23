const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

(async () => {
    try {
        await pool.getConnection();
        console.log('Database is connected successfully!');
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
})();

module.exports = pool;
