const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// ✅ Health Check Route
app.get('/', (req, res) => {
  res.send('Parcel2Go API is running 🚀');
});

// 📨 Create Quote Route
app.post('/get-quote', async (req, res) => {
  try {
    const { order } = req.body;

    const response = await axios.post('https://sandbox.parcel2go.com/api/quotes', order, {
      headers: {
        'Authorization': `Bearer ${process.env.PARCEL2GO_API_KEY}`, // make sure this is set
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Parcel2Go API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get quote', details: error.response?.data || error.message });
  }
});

// 🏷️ Create Label Route
app.post('/create-label', async (req, res) => {
  try {
    const { order } = req.body;

    // Parcel2Go API call for label creation
    const response = await axios.post('https://api.parcel2go.com/api/shipments', order, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error creating label:', error.message);
    res.status(500).json({ error: 'Failed to create label' });
  }
});

// ✅ Start Server (IMPORTANT FOR RAILWAY)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
