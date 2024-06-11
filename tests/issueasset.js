var StellarSdk = require("@stellar/stellar-sdk");
var server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

var issuingKeys = StellarSdk.Keypair.fromSecret("SD5GY5SHX6XZKNDQRP66GKQPWTLP3ODVDDFVLDUG7SBXB3IXLVYDPBED");
var receivingKeys = StellarSdk.Keypair.fromSecret("SDDGSCXFAGDGQXG2QEUMJCD24TIL3ETUMCHUFUKYVYV5DQ4ZNW5JLMMH");

var NewDollar = new StellarSdk.Asset("NewDollar", issuingKeys.publicKey());

server.loadAccount(receivingKeys.publicKey())
  .then(function (receiver) {
    var transaction = new StellarSdk.TransactionBuilder(receiver, {
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
    transaction.sign(receivingKeys);
    return server.submitTransaction(transaction);
  })
  .then(console.log)
  
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
      .setTimeout(100)
      .build();
    transaction.sign(issuingKeys);
    return server.submitTransaction(transaction);
  })
  .then(console.log)
  .catch(function (error) {
    console.error("Error!", error);
  })
  
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