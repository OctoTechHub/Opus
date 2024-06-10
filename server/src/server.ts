import express from 'express';
import fetch from 'cross-fetch';
import StellarSdk from '@stellar/stellar-sdk';

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/fund-account', async (req, res) => {
    const publicKey = req.query.publicKey as string;

    try {
        const response = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
        if (response.ok) {
            res.status(200).send('Account funded successfully!');
        } else {
            throw new Error('Failed to fund account');
        }
    } catch (error: any) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.get('/fetch-balance', async (req, res) => {
    const publicKey = req.query.publicKey as string;

    try {
        const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        const account = await server.loadAccount(publicKey);
        const balance = account.balances.find((balance: { asset_type: string; }) => balance.asset_type === 'native').balance;
        res.status(200).send(`Balance: ${balance} XLM`);
    } catch (error: any) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
