const express = require('express');
const axios = require('axios');
require('dotenv').config();
const router = express.Router();

const { MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE, MPESA_PASSKEY, MPESA_CALLBACK_URL } = process.env;

// Get OAuth token
async function getMpesaToken() {
  const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  const res = await axios.get(url, { headers: { Authorization: `Basic ${auth}` } });
  return res.data.access_token;
}

// Initiate STK Push
router.post('/mpesa/payment', async (req, res) => {
  try {
    const { phone, amount } = req.body;
    const token = await getMpesaToken();

    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '').slice(0, 14);
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

    const payload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: MPESA_CALLBACK_URL,
      AccountReference: 'AgriNova',
      TransactionDesc: 'AgriNova Payment'
    };

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.json({ status: 'success', data: response.data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message, details: error.response?.data });
  }
});

module.exports = router;
