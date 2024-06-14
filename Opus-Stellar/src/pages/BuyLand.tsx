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

  useEffect(() => {
    console.log('useEffect hook executed');
    if (location.state) {
      const { publicKey, privateKey } = location.state;
      setPublicKey(publicKey);
      setPrivateKey(privateKey);
    } else {
      const storedPublicKey = localStorage.getItem('publicKey');
      const storedPrivateKey = localStorage.getItem('privateKey');
      if (storedPublicKey && storedPrivateKey) {
        setPublicKey(storedPublicKey);
        setPrivateKey(storedPrivateKey);
      } else {
        console.warn('Public key or private key not found in local storage.');
        navigate('/'); // Redirect to home page if keys are not found
      }
    }
  }, [location, navigate]);

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
      <div className="bg-gradient-to-br from-blue-400 to-purple-600 min-h-screen flex flex-col justify-center items-center">
        <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Buy Opus Land 🌴</h2>
          <nav className="text-center text-gray-500 mb-4">
            <p className="cursor-pointer" onClick={() => handleCopyToClipboard(publicKey)}>
              Public Key: {publicKey}
              {copySuccess === publicKey && <span className="text-green-500 text-sm ml-2">Copied to clipboard!</span>}
            </p>
            <p className="cursor-pointer" onClick={() => handleCopyToClipboard(privateKey)}>
              Private Key: 🤫 {privateKey}
              {copySuccess === privateKey && <span className="text-green-500 text-sm ml-2">Copied to clipboard!</span>}
            </p>
          </nav>
          <div className="w-full max-w-screen-lg">
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
