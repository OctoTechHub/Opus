import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import OpusMap from "./components/OpusMap";
import Navbar from './components/Navbar';

const BuyLand = () => {
  const location = useLocation();
  const [publicKey, setPublicKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [copySuccess, setCopySuccess] = useState(''); 

  useEffect(() => {
    console.log('useEffect hook executed');
    if (location.state) {
      const { publicKey, secretKey } = location.state;
      setPublicKey(publicKey);
      setSecretKey(secretKey);
    } else {
      const storedPublicKey = localStorage.getItem('publicKey');
      const storedSecretKey = localStorage.getItem('secretKey');
      if (storedPublicKey && storedSecretKey) {
        setPublicKey(storedPublicKey);
        setSecretKey(storedSecretKey);
      } else {
        console.warn('Public key or secret key not found in local storage.');
      }
    }
  }, [location]);

  const handleCopyToClipboard = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopySuccess(key);
      setTimeout(() => setCopySuccess(''), 2000); // Hide the success message after 2 seconds
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-blue-400 to-purple-600 min-h-screen flex flex-col justify-center items-center ">
        <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Buy Opus Land 🌴</h2>
          <nav className="text-center text-gray-500 mb-4">
            <p className="cursor-pointer" onClick={() => handleCopyToClipboard(publicKey)}>
              Public Key: {publicKey}
              {copySuccess === publicKey && <span className="text-green-500 text-sm ml-2">Copied to clipboard!</span>}
            </p>
            <p className="cursor-pointer" onClick={() => handleCopyToClipboard(secretKey)}>
              Secret Key: 🤫 {secretKey}
              {copySuccess === secretKey && <span className="text-green-500 text-sm ml-2">Copied to clipboard!</span>}
            </p>
          </nav>
          <div className="w-full max-w-screen-lg ">
            <OpusMap publicKey={publicKey} secretKey={secretKey} />
          </div>
          <div className="mt-8">
            {/* <PaymentComponent publicKey={publicKey} secretKey={secretKey} /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyLand;
