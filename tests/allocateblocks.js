const StellarSdk = require("stellar-sdk");

async function allocateBlockID(blockID, userSecretKey, assetCode, assetIssuer, amount) {
    const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
    const userKeypair = StellarSdk.Keypair.fromSecret(userSecretKey);
    const userPublicKey = userKeypair.publicKey();

    try {
        // Load the user's account
        const userAccount = await server.loadAccount(userPublicKey);

        // Check if the user account has enough XLM for the transaction fee
        const xlmBalance = parseFloat(userAccount.balances.find(b => b.asset_type === 'native').balance);
        const requiredXlm = StellarSdk.BASE_FEE * 2; // Assuming a safety margin, multiply by 2
        if (xlmBalance < requiredXlm) {
            throw new Error(`Insufficient XLM balance (${xlmBalance} XLM) to cover the transaction fee.`);
        }

        // Define the custom asset
        const newDollarAsset = new StellarSdk.Asset(assetCode, assetIssuer);

        // Check if the user has sufficient balance of NewDollar
        const balance = userAccount.balances.find(b => b.asset_code === assetCode && b.asset_issuer === assetIssuer);
        if (!balance || parseFloat(balance.balance) < parseFloat(amount)) {
            throw new Error(`Insufficient balance of ${assetCode}`);
        }

        // Create a payment transaction using the custom asset
        const transaction = new StellarSdk.TransactionBuilder(userAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET,
            sequence: userAccount.sequenceNumber(),
        })
            .addOperation(StellarSdk.Operation.payment({
                destination: 'GA2XMHHFMN3NDSG5BLQYTDIYFYHBRQFYJ4DZKKBI7JDVIVPIVHVNA2ND', // Replace with the recipient's public key
                asset: newDollarAsset,
                amount: amount,  // Amount of NewDollar to transfer
            }))
            .addMemo(StellarSdk.Memo.text(`Allocated block ID: ${blockID}`))
            .setTimeout(30)
            .build();

        // Sign the transaction
        transaction.sign(userKeypair);

        // Submit the transaction to the network
        const transactionResult = await server.submitTransaction(transaction);
        console.log('Transaction successful:', transactionResult);

        return transactionResult;
    } catch (error) {
        console.error('Transaction failed:', error.response?.data || error.message);
        throw error;
    }
}

// Replace with actual values
const blockID = '69';
const userSecretKey = 'SAS53FAYJJMC7OOS2UIK3SIFEKND6JEGZ7FHQWOMYD5FHUDXMA77JZJU';  // Use securely in production
const assetCode = 'NewDollar';
const assetIssuer = 'GA2XMHHFMN3NDSG5BLQYTDIYFYHBRQFYJ4DZKKBI7JDVIVPIVHVNA2ND';
const amount = '10';  // Amount of NewDollar to transfer

allocateBlockID(blockID, userSecretKey, assetCode, assetIssuer, amount)
    .then(result => {
        console.log('Block ID allocated successfully:', result);
    })
    .catch(error => {
        console.error('Error allocating block ID:', error);
    });