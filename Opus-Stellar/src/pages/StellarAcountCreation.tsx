// StellarAccountCreation component
import React, { useState, useEffect } from 'react';
import { Keypair } from '@stellar/stellar-sdk';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StellarAccountCreation: React.FC = () => {
  const [keypair, setKeypair] = useState<Keypair | null>(null);
  const [fundingStatus, setFundingStatus] = useState(false);
  const [fundingResult, setFundingResult] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/stellar-sdk/10.1.1/stellar-sdk.min.js';
    document.body.appendChild(script);
  }, []);

  const handleGenerateKeypair = () => {
    const pair = Keypair.random();
    setKeypair(pair);
    localStorage.setItem('publickey', pair.publicKey());
    localStorage.setItem('secretkey', pair.secret());
  };

  const handleFundAccount = async () => {
    if (!keypair) return;
    setFundingStatus(true);
    try {
      const response = await fetch(`https://friendbot.stellar.org?addr=${keypair.publicKey()}`);
      if (response.ok) {
        setFundingResult(true);
        // Navigate to BuyLand only upon successful funding
        navigate('/buyLand', { state: { publicKey: keypair.publicKey() } });
      } else {
        throw new Error('Failed to fund account');
      }
    } catch (error: any) {
      setFundingStatus(false);
      alert(`Error: ${error.message}`);
    }
  };

  const handleFetchBalance = async () => {
    if (!keypair) return;
    try {
      const response = await axios.get(`https://horizon-testnet.stellar.org/accounts/${keypair.publicKey()}`);
      console.log(response.data.balances[0].balance);
      setBalance(response.data.balances[0].balance);
    } catch (error: any) {
      setBalance(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-500 p-8">
      <h1 className="text-3xl font-bold mb-4 text-white">Stellar Account Creation</h1>
      <button className="bg-white text-orange-500 py-2 px-4 rounded-md mb-4" onClick={handleGenerateKeypair}>
        Generate Key Pair
      </button>
      {keypair && (
        <div id="keypair" className="mb-4">
          <p className="text-white">
            <strong>Public Key:</strong> <span className="font-mono">{keypair.publicKey()}</span>
          </p>
          <p className="text-white">
            <strong>Secret Key:</strong> <span className="font-mono">{keypair.secret()}</span>
          </p>
          <button className="bg-white text-orange-500 py-2 px-4 rounded-md mt-4" onClick={handleFundAccount}>
            Fund Account
          </button>
        </div>
      )}
      {fundingStatus && (
        <div id="funding-status" className="text-white mb-4">
          <p>Funding account...</p>
        </div>
      )}
      {fundingResult && (
        <div id="funding-result" className="text-white mb-4">
          <p>Account funded successfully!</p>
        </div>
      )}
      <button className="bg-white text-orange-500 py-2 px-4 rounded-md mb-4" onClick={handleFetchBalance}>
        Fetch Balance
      </button>
      <p className="text-white" id="balance">{balance} XLMs</p>
      <div className="dets"></div>
    </div>
  );
};

export default StellarAccountCreation;
