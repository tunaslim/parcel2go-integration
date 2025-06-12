const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Parcel2Go API is running 🚀');
});

// Get OAuth2 token from Parcel2Go
async function getParcel2GoToken() {
  try {
    const payload = new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'public-api',
      client_id: process.env.PARCEL2GO_CLIENT_ID,
      client_secret: process.env.PARCEL2GO_CLIENT_SECRET,
    });

    const response = await axios.post('https://sandbox.parcel2go.com/auth/connect/token', payload.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Failed to get Parcel2Go token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Parcel2Go');
  }
}

// Get Quote Route
app.post('/get-quote', async (req, res) => {
  try {
    const { order } = req.body;

    // Get access token
    const token = await getParcel2GoToken();

    // Call Parcel2Go Quotes API
    const response = await axios.post('https://sandbox.parcel2go.com/api/quotes', order, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Parcel2Go API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get quote', details: error.response?.data || error.message });
  }
});

// Create Label Route (if needed)
app.post('/create-label', async (req, res) => {
  try {
    const { labelData } = req.body;

    // Get access token
    const token = await getParcel2GoToken();

    // Call Parcel2Go Create Label API
    const response = await axios.post('https://sandbox.parcel2go.com/api/shipments', labelData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Parcel2Go API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create label', details: error.response?.data || error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
