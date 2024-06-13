var StellarSdk = require("stellar-sdk");
var server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
var NewDollar = new StellarSdk.Asset("NewDollar","GA2XMHHFMN3NDSG5BLQYTDIYFYHBRQFYJ4DZKKBI7JDVIVPIVHVNA2ND");

server.orderbook(StellarSdk.Asset.native(), NewDollar)
  .call()
  .then(function (orderbook) {
    console.log(orderbook);
  })
  .catch(function (error) {
    console.error("Error!", error);
  });