// BuyLand component
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import OpusMap from "./components/OpusMap";

const BuyLand = () => {
  const location = useLocation();
  const [publicKey, setPublicKey] = useState('');

  useEffect(() => {
    if (location.state) {
      const { publicKey } = location.state;
      setPublicKey(publicKey);
    }
  }, [location]);

  return (
    <div className="bg-gradient-to-br from-blue-400 to-purple-600 min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-4 text-center text-gray-800">Buy Land Page</h2>
        <p className="text-lg mb-6 text-center text-gray-700">Explore available land:</p>
        <nav className="text-center text-gray-600 mb-4">
          Public Key: {publicKey}
        </nav>
        <div className="w-full max-w-screen-lg">
          <OpusMap publicKey={publicKey} secretKey={location.state.secretKey} />
        </div>
      </div>
    </div>
  );
};

export default BuyLand;
