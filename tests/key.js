const StellarSdk = require("stellar-sdk");

const keypair = StellarSdk.Keypair.random();
const secretKey = keypair.secret();

console.log(secretKey);