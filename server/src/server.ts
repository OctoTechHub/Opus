import express from 'express';
import fetch from 'cross-fetch';
import StellarSdk from '@stellar/stellar-sdk';
import  Server from '@stellar/stellar-sdk';
import axios from 'axios';
import cors from 'cors';
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(cors()); 
app.get('/fund-account/:publicKey', async (req, res) => {
    const { publicKey } = req.params;

    if (!StellarSdk.StrKey.isValidEd25519PublicKey(publicKey)) {
        return res.status(400).send('Invalid Stellar public key');
    }

    try {
        const response = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
        const responseJSON = await response.json();

        if (response.ok) {
            res.status(200).json({
                message: 'Account funded successfully',
                transaction: responseJSON,
            });
        } else {
            res.status(response.status).json({
                message: 'Failed to fund account',
                error: responseJSON,
            });
        }
    } catch (error:any) {
        res.status(500).json({
            message: 'An error occurred while funding the account',
            error: error.message,
        });
    }
});
app.get('/fetch-balance', async (req, res) => {
    try {
        const response = await axios.get(`https://horizon-testnet.stellar.org/accounts/${req.query.publicKey}`);
        console.log(response.data);
        res.send(response.data.balances);
    } catch (error: any) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
