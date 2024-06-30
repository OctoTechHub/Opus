import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OpusMap from "./components/OpusMap";
import Navbar from './components/Navbar';
import axios from 'axios';
import { ToastProvider } from '../ToastContext';

const BuyLand = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [copySuccess, setCopySuccess] = useState(''); 



  const handleCopyToClipboard = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopySuccess(key);
      setTimeout(() => setCopySuccess(''), 2000); 
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <ToastProvider>
      <Navbar />
      <div className='h-screen bg-gradient-to-br from-gray-800 to-black'>
        <div className="bg-gradient-to-br from-gray-800 to-black px-5 py-10 gap-5 justify-center flex-col text-center">
          <div className="bg-gradient-to-br from-gray-800 to-black p-6 rounded-lg shadow-lg">
            <div className="mt-8 py-2 rounded-lg bg-slate-900 w-auto to-black text-white font-mono">
              <h2 className="text-3xl font-bold text-center text-white font-mono">Buy your fandom</h2>
            </div>
            <nav className="text-center text-gray-500 mb-4"></nav>
            <div className="w-full max-w-screen-lg">
              <OpusMap publicKey={publicKey} privateKey={privateKey} />
            </div>
            
          </div>
        </div>
      </div>
    </ToastProvider>
  );
};

export default BuyLand;
