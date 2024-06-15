"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const txnSchema = new mongoose_1.default.Schema({
    txnHash: String,
    blockId: String,
    Owner: String,
});
const Txn = mongoose_1.default.model('Txn', txnSchema);
exports.default = Txn;
