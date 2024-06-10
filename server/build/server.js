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
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.static('public'));
app.get('/fund-account', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const publicKey = req.query.publicKey;
    try {
        const response = yield (0, cross_fetch_1.default)(`https://friendbot.stellar.org?addr=${publicKey}`);
        if (response.ok) {
            res.status(200).send('Account funded successfully!');
        }
        else {
            throw new Error('Failed to fund account');
        }
    }
    catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
}));
app.get('/fetch-balance', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const publicKey = req.query.publicKey;
    try {
        const server = new stellar_sdk_1.default.Server('https://horizon-testnet.stellar.org');
        const account = yield server.loadAccount(publicKey);
        const balance = account.balances.find((balance) => balance.asset_type === 'native').balance;
        res.status(200).send(`Balance: ${balance} XLM`);
    }
    catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
}));
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
