// // auth.js
// require('dotenv').config();
// const express = require('express');
// const axios = require('axios');

// const open = require('open');

// const app = express();
// const PORT = 3000;

// const authUrl = `https://api.fyers.in/api/v2/generate-authcode?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&state=xyz`;

// app.get('/callback', async (req, res) => {
//   const { code } = req.query;

//   const body = {
//     grant_type: 'authorization_code',
//     client_id: process.env.CLIENT_ID,
//     secret_key: process.env.SECRET_ID,
//     redirect_uri: process.env.REDIRECT_URI,
//     code,
//   };

//   try {
//     const response = await axios.post('https://api.fyers.in/api/v2/token', body, {
//       headers: { 'Content-Type': 'application/json' },
//     });

//     const accessToken = response.data.access_token;
//     console.log('ACCESS TOKEN:', accessToken);

//     res.send('Token generated! Check your console.');
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     res.send('Error generating token');
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server started on http://localhost:${PORT}`);
//   open(authUrl);
// });
