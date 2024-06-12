const express=require('express')
var StellarSdk = require("stellar-sdk");
const app=express();
app.use(express.json())
app.post('/buy-tokens',async(req,res)=>{
    var server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
    const body=req.body;
    console.log(body)
    var buyerKeys = StellarSdk.Keypair.fromSecret(body.secret);

    var newDollar=new StellarSdk.Asset("NewDollar","GA2XMHHFMN3NDSG5BLQYTDIYFYHBRQFYJ4DZKKBI7JDVIVPIVHVNA2ND");
    server.loadAccount(buyerKeys.publicKey())
  .then(function (buyer) {
    var transaction = new StellarSdk.TransactionBuilder(buyer, {
      fee: 100,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.changeTrust({
          asset: newDollar,
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
          buying: newDollar,
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
    res.send("done");
})
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})