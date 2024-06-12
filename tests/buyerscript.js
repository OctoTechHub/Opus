var StellarSdk = require("@stellar/stellar-sdk");
var server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

// Buyer's keypair
var buyerKeys = StellarSdk.Keypair.fromSecret("SB7Y7COPXOZPQAHJLJRNYN4DDRCV2LPHQZGUWZ3I6YJIFU7TFCYAQFYM");

// Asset to buy
var NewDollar = new StellarSdk.Asset("NewDollar", "GC7HI3ZGXLFTNFH6YBJ2TW3FIGHPQ245JLOC7DTYUNGS724F7ZN6WN22");

// Create trustline to the asset
server.loadAccount(buyerKeys.publicKey())
  .then(function (buyer) {
    var transaction = new StellarSdk.TransactionBuilder(buyer, {
      fee: 100,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.changeTrust({
          asset: NewDollar,
          limit: "1000",
        }),
      )
      .setTimeout(100)
      .build();
    transaction.sign(buyerKeys);
    return server.submitTransaction(transaction);
  })
  .then(console.log)
  .then(function () {
    // Create buy offer
    return server.loadAccount(buyerKeys.publicKey());
  })
  .then(function (buyer) {
    var transaction = new StellarSdk.TransactionBuilder(buyer, {
      fee: 100,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.manageBuyOffer({
          selling: StellarSdk.Asset.native(),
          buying: NewDollar,
          buyAmount: "10", // Amount of NewDollar to buy
          price: "1", // Price in XLM per NewDollar
        }),
      )
      .setTimeout(100)
      .build();
    transaction.sign(buyerKeys);
    return server.submitTransaction(transaction);
  })
  .then(console.log)
  .catch(function (error) {
    console.error("Error!", error);
  });