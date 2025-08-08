// generate-token.js
require("dotenv").config();
const express = require("express");
const { fyersModel } = require("fyers-api-v3");
const open = require("open");
const app = express();
const PORT = 8080;

// Initialize Fyers
const fyers = new fyersModel();
fyers.setAppId(process.env.FYERS_APP_ID);
fyers.setRedirectUrl(process.env.FYERS_REDIRECT_URI);

// Step 1: Generate Auth URL
const authURL = fyers.generateAuthCode();
console.log("Opening Fyers login...");
open.default(authURL);

// Step 2: Start server to catch redirect with auth_code
app.get("/", async (req, res) => {
    const auth_code = req.query.auth_code;
    console.log('app running')

    console.log({auth_code})
    if (!auth_code) {
        return res.send("Auth code not found in request");
    }

    try {
        console.log("token")
        const tokenRes = await fyers.generate_access_token({
            auth_code,
            secret_key: process.env.FYERS_SECRET_ID,
        });

        const accessToken = tokenRes.access_token;
        console.log("✅ ACCESS TOKEN:", accessToken);

        // Optional: Save it to file or .env
        const fs = require("fs");
        fs.writeFileSync("fyers-access-token.txt", accessToken);
        res.send("Access token generated successfully. Check console or fyers-access-token.txt");
    } catch (err) {
        console.error("Error generating access token:", err.message);
        res.send("Failed to generate access token.");
    } finally {
        setTimeout(() => process.exit(), 2000); // Close server after token fetch
    }
});

app.listen(PORT, () => {
    console.log(`Waiting for Fyers redirect on http://localhost:${PORT}/callback`);
});
