const express = require('express');
const pool = require('../db');
const { validateSchoolInput } = require("../utils/validators");
const { calculateDistance } = require('../utils/distanceCalculator');
const router = express.Router();

// Add School API
router.post('/addSchool', async (req, res) => {
    const { name, address, latitude, longitude } = req.body;
    const validation = validateSchoolInput(name, address, latitude, longitude);
    if (!validation.valid) {
        return res.status(400).json({ error: validation.message });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name, address, latitude, longitude]
        );
        res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// List Schools API
router.get('/listSchools', async (req, res) => {
    const { latitude, longitude } = req.query;

    // Validate user input
    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        // Fetch all schools from the database
        const [schools] = await pool.promise().execute('SELECT id, name, address, latitude, longitude FROM schools');

        const userLat = parseFloat(latitude);
        const userLon = parseFloat(longitude);

        // Calculate distance for each school and sort by proximity
        const sortedSchools = schools.map(school => ({
            ...school,
            distance: calculateDistance(userLat, userLon, school.latitude, school.longitude),
        })).sort((a, b) => a.distance - b.distance);

        res.json(sortedSchools);
    } catch (error) {
        console.error('Error fetching schools:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
