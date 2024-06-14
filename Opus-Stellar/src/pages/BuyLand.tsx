import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OpusMap from "./components/OpusMap";
import Navbar from './components/Navbar';

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
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-gray-800 to-black rounded-lg px-5 py-10 gap-5 justify-center flex-col text-center">
        <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Buy Opus Land 🌴</h2>
          <nav className="text-center text-gray-500 mb-4">
           
          </nav>
          <div className="w-full max-w-screen-lg ">
            <OpusMap publicKey={publicKey} privateKey={privateKey} />
          </div>
          <div className="mt-8">
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyLand;
