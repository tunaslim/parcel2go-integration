// =========================
// Backend: Express.js API
// =========================

// File: /api/index.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

// Authenticate and get access token
async function authenticate() {
    const tokenUrl = 'https://api.parcel2go.com/v4/authentication/token';
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

    const response = await axios.post(tokenUrl, 'grant_type=client_credentials', {
        headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data.access_token;
}

// Get Quote Endpoint
app.post('/get-quote', async (req, res) => {
    try {
        const token = await authenticate();
        const { sender, recipient, parcels } = req.body;

        const response = await axios.post('https://api.parcel2go.com/api/v2/shipments/quotes',
            { sender, recipient, parcels },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        res.json(response.data);
    } catch (err) {
        console.error('Error fetching quote:', err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to fetch quote.' });
    }
});

// Create Label Endpoint
app.post('/create-label', async (req, res) => {
    try {
        const token = await authenticate();
        const { sender, recipient, parcels, service_code } = req.body;

        const labelResponse = await axios.post('https://api.parcel2go.com/api/v2/shipments',
            { sender, recipient, parcels, service_code },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        res.json(labelResponse.data);
    } catch (err) {
        console.error('Error creating label:', err.response?.data || err.message);
        res.status(500).json({ error: 'Label creation failed.' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
