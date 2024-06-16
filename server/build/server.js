"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const stellar_sdk_1 = __importDefault(require("@stellar/stellar-sdk"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = __importDefault(require("./mongoose"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
app.use((0, cors_1.default)());
mongoose_1.default.connect("mongodb+srv://Haard18:Haard1808@cluster0.zuniu39.mongodb.net/stellar")
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
app.get('/fund-account/:publicKey', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { publicKey } = req.params;
    if (!stellar_sdk_1.default.StrKey.isValidEd25519PublicKey(publicKey)) {
        return res.status(400).send('Invalid Stellar public key');
    }
    try {
        const response = yield (0, cross_fetch_1.default)(`https://friendbot.stellar.org?addr=${publicKey}`);
        const responseJSON = yield response.json();
        if (response.ok) {
            res.status(200).json({
                message: 'Account funded successfully',
                transaction: responseJSON,
            });
        }
        else {
            res.status(response.status).json({
                message: 'Failed to fund account',
                error: responseJSON,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'An error occurred while funding the account',
            error: error.message,
        });
    }
}));
app.get('/allowners', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allOwners = yield mongoose_2.default.find();
        res.send(allOwners);
    }
    catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
}));
app.get('/fetch-balance', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`https://horizon-testnet.stellar.org/accounts/${req.query.publicKey}`);
        console.log(response.data);
        res.send(response.data.balances);
    }
    catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
}));
app.post('/buy-tokens', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var server = new stellar_sdk_1.default.Horizon.Server("https://horizon-testnet.stellar.org");
    const { secret, amount } = req.body;
    if (!secret) {
        return res.status(400).send({ error: "Secret key is required" });
    }
    let buyerKeys;
    try {
        buyerKeys = stellar_sdk_1.default.Keypair.fromSecret(secret);
    }
    catch (error) {
        return res.status(400).send({ error: "Invalid secret key" });
    }
    const OpusToken = new stellar_sdk_1.default.Asset("OpusToken", "GCS3RTHPWKFZUHRL7A4VJGGS4JPWU6EOZTHKG25LCTXBVARKUGY6DEFS");
    try {
        const buyerAccount = yield server.loadAccount(buyerKeys.publicKey());
        let transaction = new stellar_sdk_1.default.TransactionBuilder(buyerAccount, {
            fee: stellar_sdk_1.default.BASE_FEE,
            networkPassphrase: stellar_sdk_1.default.Networks.TESTNET,
        })
            .addOperation(stellar_sdk_1.default.Operation.changeTrust({
            asset: OpusToken,
            limit: "1000",
        }))
            .setTimeout(100)
            .build();
        transaction.sign(buyerKeys);
        yield server.submitTransaction(transaction);
        console.log("Trustline created successfully");
        const updatedBuyerAccount = yield server.loadAccount(buyerKeys.publicKey());
        transaction = new stellar_sdk_1.default.TransactionBuilder(updatedBuyerAccount, {
            fee: stellar_sdk_1.default.BASE_FEE,
            networkPassphrase: stellar_sdk_1.default.Networks.TESTNET,
        })
            .addOperation(stellar_sdk_1.default.Operation.manageBuyOffer({
            selling: stellar_sdk_1.default.Asset.native(),
            buying: OpusToken,
            buyAmount: amount,
            price: "10",
        }))
            .setTimeout(100)
            .build();
        transaction.sign(buyerKeys);
        yield server.submitTransaction(transaction);
        console.log("Buy offer created successfully");
        res.send({ message: "Buy offer created successfully" });
    }
    catch (error) {
        console.error("Error!", error);
        res.status(500).send({ error: "An error occurred while processing the transaction" });
    }
}));
app.get('/fetch-OpusToken/:publickey', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var server = new stellar_sdk_1.default.Horizon.Server("https://horizon-testnet.stellar.org");
    const { publickey } = req.params;
    // var buyerkeys = StellarSdk.Keypair.fromSecret(privatekey);
    server.loadAccount(publickey).then(function (balance) {
        var opusTokenBalance = balance.balances.find(function (balance) {
            return balance.asset_code === "OpusToken" && balance.asset_issuer === "GCS3RTHPWKFZUHRL7A4VJGGS4JPWU6EOZTHKG25LCTXBVARKUGY6DEFS";
        });
        // If the user has OpusToken, log the balance
        if (opusTokenBalance) {
            console.log("OpusToken balance: " + opusTokenBalance.balance);
            res.send({ balance: opusTokenBalance.balance });
        }
        else {
            console.log("The user does not have any OpusToken.");
            res.send({ balance: "0" });
        }
    }).catch(function (err) {
        console.error("Could not load account!", err);
    });
}));
app.post('/buy-block', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const server = new stellar_sdk_1.default.Horizon.Server("https://horizon-testnet.stellar.org");
    console.log(req.body);
    const { publickey, privatekey, blockid } = req.body; // Ensure you have correct key names from the request
    const userKeypair = stellar_sdk_1.default.Keypair.fromSecret(privatekey);
    try {
        const userAccount = yield server.loadAccount(publickey);
        const xlmBalance = parseFloat(userAccount.balances.find((b) => b.asset_type === 'native').balance);
        const requiredXlm = stellar_sdk_1.default.BASE_FEE * 2; // Assuming a safety margin, multiply by 2
        if (xlmBalance < requiredXlm) {
            throw new Error(`Insufficient XLM balance (${xlmBalance} XLM) to cover the transaction fee.`);
        }
        const OpusToken = new stellar_sdk_1.default.Asset("OpusToken", "GCS3RTHPWKFZUHRL7A4VJGGS4JPWU6EOZTHKG25LCTXBVARKUGY6DEFS");
        const balance = userAccount.balances.find((b) => b.asset_code === "OpusToken" && b.asset_issuer === "GCS3RTHPWKFZUHRL7A4VJGGS4JPWU6EOZTHKG25LCTXBVARKUGY6DEFS");
        if (!balance || parseFloat(balance.balance) < 0.5) {
            throw new Error(`Insufficient balance of OpusToken`);
        }
        const transaction = new stellar_sdk_1.default.TransactionBuilder(userAccount, {
            fee: stellar_sdk_1.default.BASE_FEE,
            networkPassphrase: stellar_sdk_1.default.Networks.TESTNET,
            sequence: userAccount.sequenceNumber(),
        })
            .addOperation(stellar_sdk_1.default.Operation.payment({
            destination: 'GAXOAKDTMXDPDXTR34ZFANQCIK2EC5WBNRA2AQYJDPXGZQ73COVCVDNJ', // Replace with the recipient's public key
            asset: OpusToken,
            amount: '0.5', // Amount of OpusToken to transfer
        }))
            .addMemo(stellar_sdk_1.default.Memo.text("Issued Block ID: " + blockid))
            .setTimeout(30)
            .build();
        transaction.sign(userKeypair);
        const transactionResult = yield server.submitTransaction(transaction);
        console.log('Transaction successful:', transactionResult);
        const newTxn = new mongoose_2.default({
            txnHash: transactionResult.hash,
            blockId: blockid,
            Owner: publickey,
        });
        yield newTxn.save();
        console.log('Transaction data saved to MongoDB');
        return res.send({ message: 'Transaction successful', transaction: transactionResult });
    }
    catch (error) {
        console.error('Transaction failed:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        return res.status(500).send({ message: 'Transaction failed', error: ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message });
    }
}));
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
