const { Server, Keypair, TransactionBuilder, Networks, Operation } = require('stellar-sdk');

async function handleBuyLandTransaction(senderSecretKey, buyerPublicKey, amount) {
    const server = new Server('https://horizon-testnet.stellar.org');

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

const senderSecretKey = 'GDO7FWR4MJ63RE4ONSTFKLX4V7G2365SN47JW2QQMD6EQXS743DRYZUM';
const buyerPublicKey = 'SCYMLP6EZFQOOJQKS2PEIU76OSEBYNJIRTY6VMKGXM74GMWZ346WSGWP ';
const amount = 100; 

handleBuyLandTransaction(senderSecretKey, buyerPublicKey, amount)
    .then((transactionResult) => {
        console.log('Transaction result:', transactionResult);
    })
    .catch((error) => {
        console.error('Transaction failed:', error);
    });
