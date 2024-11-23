const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

app.use('/', require('./routes/schoolRoutes'));

// Root route to show "Server is OK"
app.get('/', (req, res) => {
    res.status(200).send('Server is OK');
});

// Test database connection
(async () => {
    try {
        await pool.getConnection();
        console.log('Database is connected successfully!');
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
})();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
