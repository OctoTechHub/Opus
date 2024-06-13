import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import OpusMap from "./components/OpusMap";
import PaymentComponent from "./components/PaymentComponent";

const BuyLand = () => {
  const location = useLocation();
  const [publicKey, setPublicKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  useEffect(() => {
    console.log('useEffect hook executed');
    if (location.state) {
      const { publicKey, secretKey } = location.state;
      setPublicKey(publicKey);
      setSecretKey(secretKey);
    }
  }, [location]);

  console.log('PublicKey:', publicKey);
  console.log('SecretKey:', secretKey);

  return (
    <div className="bg-gradient-to-br from-blue-400 to-purple-600 min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-4 text-center text-gray-800">Buy Land Page</h2>
        <p className="text-lg mb-6 text-center text-gray-700">Explore available land:</p>
        <nav className="text-center text-gray-600 mb-4">
          Public Key: {publicKey}
          <br />
          Secret Key: {secretKey}
        </nav>
        <div className="w-full max-w-screen-lg">
          <OpusMap publicKey={publicKey} secretKey={secretKey} />
        </div>
        <div className="mt-8">
          <PaymentComponent publicKey={publicKey} secretKey={secretKey} />
        </div>
      </div>
    </div>
  );
};

export default BuyLand;
