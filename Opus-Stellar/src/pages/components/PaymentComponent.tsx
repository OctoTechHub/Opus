import { useState } from 'react';
import StellarSdk from '@stellar/stellar-sdk';

const PaymentComponent = ({ publicKey }: { publicKey: string }) => {
  const [amount, setAmount] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const handlePayment = async () => {
    try {
      const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

      const receivingAccount = await server.loadAccount(publicKey);

      const transaction = new StellarSdk.TransactionBuilder(receivingAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: 'RECEIVING_PUBLIC_KEY_HERE',
            asset: StellarSdk.Asset.native(),
            amount: amount,
          })
        )
        .setTimeout(30)
        .build();

      // Sign transaction
      transaction.sign(StellarSdk.Keypair.fromSecret(secretKey));

      // Submit transaction
      const transactionResult = await server.submitTransaction(transaction);

      setPaymentStatus('Payment successful!');
      console.log(transactionResult);
    } catch (error) {
      setPaymentStatus('Payment failed!');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Make Payment</h2>
      <input type="text" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <input type="password" placeholder="Enter secret key" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} />
      <button onClick={handlePayment}>Pay</button>
      {paymentStatus && <p>{paymentStatus}</p>}
    </div>
  );
};

export default PaymentComponent;
