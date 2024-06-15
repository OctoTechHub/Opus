import express from 'express';
import fetch from 'cross-fetch';
import StellarSdk from '@stellar/stellar-sdk';
import Server from '@stellar/stellar-sdk';
import axios from 'axios';
import cors from 'cors';
import mongoose from 'mongoose';
import Txn from './mongoose';
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));
app.use(cors());
mongoose.connect("mongodb+srv://Haard18:Haard1808@cluster0.zuniu39.mongodb.net/stellar")
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
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
app.post('/buy-block', async (req, res) => {
    const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
    const { publickey, privatekey, blockid } = req.body; // Ensure you have correct key names from the request
    const userKeypair = StellarSdk.Keypair.fromSecret(privatekey);

    try {
        const userAccount = await server.loadAccount(publickey);
        const xlmBalance = parseFloat(userAccount.balances.find((b:any) => b.asset_type === 'native').balance);
        const requiredXlm = StellarSdk.BASE_FEE * 2; // Assuming a safety margin, multiply by 2

        if (xlmBalance < requiredXlm) {
            throw new Error(`Insufficient XLM balance (${xlmBalance} XLM) to cover the transaction fee.`);
        }

        const OpusToken = new StellarSdk.Asset("OpusToken", "GCS3RTHPWKFZUHRL7A4VJGGS4JPWU6EOZTHKG25LCTXBVARKUGY6DEFS");
        const balance = userAccount.balances.find((b:any) => b.asset_code === "OpusToken" && b.asset_issuer === "GCS3RTHPWKFZUHRL7A4VJGGS4JPWU6EOZTHKG25LCTXBVARKUGY6DEFS");

        if (!balance || parseFloat(balance.balance) < 0.5) {
            throw new Error(`Insufficient balance of OpusToken`);
        }

        const transaction = new StellarSdk.TransactionBuilder(userAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET,
            sequence: userAccount.sequenceNumber(),
        })
            .addOperation(StellarSdk.Operation.payment({
                destination: 'GAXOAKDTMXDPDXTR34ZFANQCIK2EC5WBNRA2AQYJDPXGZQ73COVCVDNJ', // Replace with the recipient's public key
                asset: OpusToken,
                amount: '0.5',  // Amount of OpusToken to transfer
            }))
            .addMemo(StellarSdk.Memo.text("Issued Block ID: " + blockid))
            .setTimeout(30)
            .build();

        transaction.sign(userKeypair);
        const transactionResult = await server.submitTransaction(transaction);
        console.log('Transaction successful:', transactionResult);

        const newTxn = new Txn({
            txnHash: transactionResult.hash,
            blockId: blockid,
            Owner: publickey,
        });

        await newTxn.save();
        console.log('Transaction data saved to MongoDB');

        return res.send({ message: 'Transaction successful', transaction: transactionResult });
    }
    catch (error:any) {
        console.error('Transaction failed:', error.response?.data || error.message);
        return res.status(500).send({ message: 'Transaction failed', error: error.response?.data || error.message });
    }
});
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});