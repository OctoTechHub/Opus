import express from 'express';
import fetch from 'cross-fetch';
import StellarSdk from '@stellar/stellar-sdk';
import Server from '@stellar/stellar-sdk';
import axios from 'axios';
import cors from 'cors';
const app = express();
const port = 3000;

app.use(express.json());
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
    } catch (error: any) {
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

app.post('/buy-tokens', async (req, res) => {
    var server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
    const { secret, amount } = req.body;

    if (!secret) {
        return res.status(400).send({ error: "Secret key is required" });
    }

    let buyerKeys;
    try {
        buyerKeys = StellarSdk.Keypair.fromSecret(secret);
    } catch (error) {
        return res.status(400).send({ error: "Invalid secret key" });
    }

    const OpusToken = new StellarSdk.Asset("OpusToken", "GCS3RTHPWKFZUHRL7A4VJGGS4JPWU6EOZTHKG25LCTXBVARKUGY6DEFS");

    try {
        const buyerAccount = await server.loadAccount(buyerKeys.publicKey());
        let transaction = new StellarSdk.TransactionBuilder(buyerAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET,
        })
            .addOperation(
                StellarSdk.Operation.changeTrust({
                    asset: OpusToken,
                    limit: "1000",
                })
            )
            .setTimeout(100)
            .build();
        transaction.sign(buyerKeys);
        await server.submitTransaction(transaction);
        console.log("Trustline created successfully");

        // Load the buyer's account again and create a buy offer
        const updatedBuyerAccount = await server.loadAccount(buyerKeys.publicKey());
        transaction = new StellarSdk.TransactionBuilder(updatedBuyerAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET,
        })
            .addOperation(
                StellarSdk.Operation.manageBuyOffer({
                    selling: StellarSdk.Asset.native(),
                    buying: OpusToken,
                    buyAmount: amount, // Amount of OpusToken to buy
                    price: "10", // Price in XLM per OpusToken
                })
            )
            .setTimeout(100)
            .build();
        transaction.sign(buyerKeys);
        await server.submitTransaction(transaction);
        console.log("Buy offer created successfully");

        res.send({ message: "Buy offer created successfully" });
    } catch (error) {
        console.error("Error!", error);
        res.status(500).send({ error: "An error occurred while processing the transaction" });
    }
});
app.get('/fetch-OpusToken/:publickey', async (req, res) => {
    var server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
    const { publickey } = req.params;
    // var buyerkeys = StellarSdk.Keypair.fromSecret(privatekey);
    server.loadAccount(publickey).then(function (balance: any) {
        var opusTokenBalance = balance.balances.find(function (balance: any) {
            return balance.asset_code === "OpusToken" && balance.asset_issuer === "GCS3RTHPWKFZUHRL7A4VJGGS4JPWU6EOZTHKG25LCTXBVARKUGY6DEFS";
        });

        // If the user has OpusToken, log the balance
        if (opusTokenBalance) {
            console.log("OpusToken balance: " + opusTokenBalance.balance);
            res.send({ balance: opusTokenBalance.balance });
        } else {
            console.log("The user does not have any OpusToken.");
            res.send({ balance: "0" });
        }
    }).catch(function (err: any) {
        console.error("Could not load account!", err);
    });

})
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});