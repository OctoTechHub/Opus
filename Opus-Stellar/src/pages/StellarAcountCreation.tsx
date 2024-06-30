import React, { useState } from 'react';
import { Keypair } from '@stellar/stellar-sdk';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import logo from '../../public/173474766.png';

const StellarAccountCreation = () => {
  const [privatekey, setprivatekey] = useState('');
  const [publickey, setpublickey] = useState('');
  const [keypair, setkeypair] = useState<Keypair | null>(null);
  const [generated, setGenerated] = useState(false);
  const navigate = useNavigate();

  const handlechange = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
    if (value === 'publickey') {
      setpublickey(e.target.value);
    } else {
      setprivatekey(e.target.value);
    }
  };

  const handleSubmit = () => {
    if (!publickey || !privatekey) return;
    localStorage.setItem('publickey', publickey);
    localStorage.setItem('privatekey', privatekey);
    navigate('/buyAsset');
  };

  const handleGenerate = () => {
    const pair = Keypair.random();
    setkeypair(pair);
    setprivatekey(pair.secret());
    setpublickey(pair.publicKey());
    localStorage.setItem('publickey', pair.publicKey());
    localStorage.setItem('privatekey', pair.secret());
    setGenerated(true); 
  };

  const downloadKeyPairAsTextFile = (keypair: Keypair) => {
    const keyPairText = `Public Key: ${keypair.publicKey()}\nSecret Key: ${keypair.secret()}`;
    const blob = new Blob([keyPairText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keypair.txt';
    a.click();
  };

  const handledownloadclick = () => {
    if (keypair) {
      downloadKeyPairAsTextFile(keypair);
    }
    navigate('/buyAsset');
  };

  const copyToClipboardAndShowToast = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success(`Copied ${text.substring(0, 10)}... to clipboard`);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center w-screen bg-gradient-to-br from-gray-500 to-black items-center h-screen">
        <ToastContainer />
        <div className="flex h-4/5 bg-black text-white rounded-lg px-5 py-10 gap-5 justify-center flex-col text-center">
          <h1 className="text-4xl font-bold font-mono">
            <img src={logo} alt="Fantility Logo" className="h-12 inline-block" />
          </h1>
          <p className="text-2xl font-bold font-mono">Claim Your Virtual Territory Today!</p>
          <input
            autoComplete="off"
            onChange={(e) => handlechange(e, 'publickey')}
            id="publickey"
            type="text"
            placeholder="Enter Public Key"
            className="px-3 py-2 text-black bg-white rounded-lg font-mono"
          />
          <input
            autoComplete="off"
            onChange={(e) => handlechange(e, 'privatekey')}
            id="privatekey"
            type="text"
            placeholder="Enter Private Key"
            className="px-3 py-2 bg-white text-black rounded-lg font-mono"
          />
          <button
            onClick={handleSubmit}
            className="px-2 py-2 rounded-lg bg-orange-500 hover:bg-orange-700 transition duration-200 font-mono"
          >
            Enter to your fandom
          </button>
          {generated && (
            <div className="text-wrap">
              <p className="font-mono">
                <strong>Public Key:</strong>
                <span
                  className="ml-2 cursor-pointer text-gray-200 font-mono"
                  onClick={() => {
                    copyToClipboardAndShowToast(publickey);
                  }}
                >
                  {publickey}
                </span>
              </p>
              <p className="font-mono">
                <strong>Private Key:</strong>
                <span
                  className="ml-2 cursor-pointer text-gray-200 font-mono"
                  onClick={() => {
                    copyToClipboardAndShowToast(privatekey);
                  }}
                >
                  {privatekey}
                </span>
              </p>
              <button
                onClick={handledownloadclick}
                className="px-2 py-2 rounded-lg bg-orange-500 hover:bg-orange-700 transition duration-200 mt-4 font-mono"
              >
                Download Your Keys
              </button>
            </div>
          )}
          {!generated && (
            <div className="text-semibold mt-4 text-white font-mono">
              New to Fantility? Create an Account
              <button
                onClick={handleGenerate}
                className="ml-2 px-2 py-1 rounded-lg bg-orange-500 hover:bg-orange-700 transition duration-200 text-sm font-mono"
              >
                Join Today
              </button>
            </div>
          )}
        </div>
      </div>
    
    </>
  );
};

export default StellarAccountCreation;
