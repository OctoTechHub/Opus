import StellarSdk from 'stellar-sdk';

async function allocateBlockID(blockID: string, userSecretKey: string, assetCode: string, assetIssuer: string, amount: string) {
  const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
  const userKeypair = StellarSdk.Keypair.fromSecret(userSecretKey);
  const userPublicKey = userKeypair.publicKey();

  try {
    const userAccount = await server.loadAccount(userPublicKey);

    const xlmBalance = parseFloat(userAccount.balances.find((b: { asset_type: string; }) => b.asset_type === 'native').balance);
    const requiredXlm = StellarSdk.BASE_FEE * 2;
    if (xlmBalance < requiredXlm) {
      throw new Error(`Insufficient XLM balance (${xlmBalance} XLM) to cover the transaction fee.`);
    }

    const newDollarAsset = new StellarSdk.Asset(assetCode, assetIssuer);

    const balance = userAccount.balances.find((b: { asset_code: string; asset_issuer: string; }) => b.asset_code === assetCode && b.asset_issuer === assetIssuer);
    if (!balance || parseFloat(balance.balance) < parseFloat(amount)) {
      throw new Error(`Insufficient balance of ${assetCode}`);
    }

    const transaction = new StellarSdk.TransactionBuilder(userAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
      sequence: userAccount.sequenceNumber(),
    })
      .addOperation(StellarSdk.Operation.payment({
        destination: 'GA2XMHHFMN3NDSG5BLQYTDIYFYHBRQFYJ4DZKKBI7JDVIVPIVHVNA2ND', 
        asset: newDollarAsset,
        amount: amount,  
      }))
      .addMemo(StellarSdk.Memo.text(`Allocated block ID: ${blockID}`))
      .setTimeout(30)
      .build();

    transaction.sign(userKeypair);

    const transactionResult = await server.submitTransaction(transaction);
    console.log('Transaction successful:', transactionResult);

    return transactionResult;
  } catch (error: any) {
    console.error('Transaction failed:', error.response?.data || error.message);
    throw error;
  }
}

export default allocateBlockID;
