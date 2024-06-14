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
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.static('public'));
app.use((0, cors_1.default)());
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
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
