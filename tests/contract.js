const { Keypair, TransactionBuilder, Networks, Operation } = require('stellar-sdk');
var StellarSdk = require("stellar-sdk");
async function handleBuyLandTransaction(senderSecretKey, buyerPublicKey, amount) {
    var server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
    const senderKeypair = Keypair.fromSecret(senderSecretKey);
    const buyerKeypair = Keypair.fromPublicKey(buyerPublicKey);

    const asset = new Asset('LAND', senderKeypair.publicKey());

    try {
        const transaction = new TransactionBuilder(await server.loadAccount(buyerKeypair.publicKey()), {
            fee: '100',
            networkPassphrase: Networks.TESTNET,
        })
            .addOperation(Operation.changeTrust({
                asset: asset,
            }))
            .addOperation(Operation.payment({
                destination: senderKeypair.publicKey(),
                amount: amount.toString(),
                asset: asset,
            }))
            .setTimeout(100)
            .build();

        transaction.sign(senderKeypair);

        const transactionResult = await server.submitTransaction(transaction);

        return transactionResult;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

const senderSecretKey = 'GA2XMHHFMN3NDSG5BLQYTDIYFYHBRQFYJ4DZKKBI7JDVIVPIVHVNA2ND';
const buyerPublicKey = 'SBX5NSTIVW2WUML64RQTJLPT7ZXM4GYGGNPRWMUF6A6V6UZHUIQBFYI3';
const amount = 100; 

handleBuyLandTransaction(senderSecretKey, buyerPublicKey, amount)
    .then((transactionResult) => {
        console.log('Transaction result:', transactionResult);
    })
    .catch((error) => {
        console.error('Transaction failed:', error);
    });
