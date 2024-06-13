import { useEffect, useState } from 'react';
import allocateBlockID from '../utils/allocateBlockID';
import { txnModel, connectToMongoose } from '../utils/mongooseSetup';

const blockID = '69';
const assetCode = 'NewDollar';
const assetIssuer = 'GA2XMHHFMN3NDSG5BLQYTDIYFYHBRQFYJ4DZKKBI7JDVIVPIVHVNA2ND';
const amount = '10';

const BuyButton = () => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState<string>('');

  useEffect(() => {
    const storedPublicKey = localStorage.getItem('publicKey');
    if (storedPublicKey) {
      setPublicKey(storedPublicKey);
    }
  }, []);

  const handleBuyClick = async () => {
    try {
      if (!publicKey) {
        throw new Error('Public key not found in localStorage');
      }
      if (!secretKey) {
        throw new Error('Please enter your secret key');
      }

      const result = await allocateBlockID(blockID, secretKey, assetCode, assetIssuer, amount);

      await connectToMongoose();
      const newTransaction = new txnModel({
        blockID,
        amount,
        owner: publicKey,
        transactionID: result.transactionId,
        status: 'success',
      });
      await newTransaction.save();

      console.log('Block ID allocated successfully:', result);
    } catch (error) {
      console.error('Error allocating block ID:', error);
    }
  };

  const handleSecretKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSecretKey(event.target.value);
  };

  const handlePublicKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPublicKey(event.target.value);
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <input type="text" value={publicKey || ''} onChange={handlePublicKeyChange} placeholder="Enter your public key" />
      </div>
      <div>
        <input type="text" value={secretKey} onChange={handleSecretKeyChange} placeholder="Enter your secret key" />
        <button onClick={handleBuyClick}>Buy Block</button>
      </div>
    </div>
  );
};

export default BuyButton;
