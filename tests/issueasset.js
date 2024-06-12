// const { configDotenv } = require("dotenv");
var StellarSdk = require("@stellar/stellar-sdk");
var server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
const dotenv = require("dotenv"); dotenv.config();
const issuer=process.env.ISSUING_SECRET;
const receiver=process.env.RECEIVING_SECRET;

// Keys for accounts to issue and receive the new asset
var issuingKeys = StellarSdk.Keypair.fromSecret("SD3W5DMC4VPBWNGSMWREAB5PYJ7JBKM5GQNZ6CT7UQVZ7SPACWQCDQFZ");
var receivingKeys = StellarSdk.Keypair.fromSecret("SDJN3FTAXGSZ3SGGS47R42F3E72PJVJQN47JU24Y4EHKS4IBPLGLGLFP");

// Create an object to represent the new asset
var NewDollar = new StellarSdk.Asset("NewDollar", issuingKeys.publicKey());

// First, the receiving account must trust the asset
server.loadAccount(receivingKeys.publicKey())
  .then(function (receiver) {
    var transaction = new StellarSdk.TransactionBuilder(receiver, {
      fee: 100,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      // The `changeTrust` operation creates (or alters) a trustline
      // The `limit` parameter below is optional
      .addOperation(
        StellarSdk.Operation.changeTrust({
          asset: NewDollar,
          limit: "1000",
        }),
      )
      // setTimeout is required for a transaction
      .setTimeout(100)
      .build();
    transaction.sign(receivingKeys);
    return server.submitTransaction(transaction);
  })
  .then(console.log)
  
  // Second, the issuing account actually sends a payment using the asset
  .then(function () {
    return server.loadAccount(issuingKeys.publicKey());
  })
  .then(function (issuer) {
    var transaction = new StellarSdk.TransactionBuilder(issuer, {
      fee: 100,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: receivingKeys.publicKey(),
          asset: NewDollar,
          amount: "10",
        }),
      )
      // setTimeout is required for a transaction
      .setTimeout(100)
      .build();
    transaction.sign(issuingKeys);
    return server.submitTransaction(transaction);
  })
  .then(console.log)
  .catch(function (error) {
    console.error("Error!", error);
  })
  
  // Create a sell offer for the new asset
  .then(function () {
    return server.loadAccount(issuingKeys.publicKey());
  })
  .then(function (issuer) {
    var transaction = new StellarSdk.TransactionBuilder(issuer, {
      fee: 100,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.manageSellOffer({
          selling: NewDollar,
          buying: StellarSdk.Asset.native(),
          amount: '10', // Amount of NewDollar to sell
          price: '1', // Price in XLM per NewDollar
        }),
      )
      .setTimeout(100)
      .build();
    transaction.sign(issuingKeys);
    return server.submitTransaction(transaction);
  })
  .then(console.log)
  .catch(function (error) {
    console.error('Error!', error);
  });