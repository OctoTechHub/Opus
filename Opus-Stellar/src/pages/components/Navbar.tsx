import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [copySuccess, setCopySuccess] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedPublicKey = localStorage.getItem('publickey');
    const storedSecretKey = localStorage.getItem('secretkey');
    if (storedPublicKey) {
      setPublicKey(storedPublicKey.toLowerCase()); 
    }
    if (storedSecretKey) {
      setSecretKey(storedSecretKey);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('publickey');
    localStorage.removeItem('secretkey');
    navigate('/');
  };

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
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-lg font-bold text-gray-800">
            Stellar App
          </Link>
          <div className="relative">
            <button
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
             Profile
            </button>
            {showProfileDropdown && (
              <div
                className="absolute right-0 mt-2 w-80 bg-white rounded shadow-md py-2 border border-gray-200"
                onClick={() => setShowProfileDropdown(false)}
              >
                <div className="px-4 py-2">
                  <p
                    className="text-gray-800 cursor-pointer"
                    onClick={() => handleCopyToClipboard(publicKey)}
                  >
                   👥 Public Key: {publicKey}
                  </p>
                  {copySuccess === publicKey && (
                    <div className="text-green-500 text-sm">Copied to clipboard!</div>
                  )}
                </div>
                <div className="border-t border-gray-200 mt-2"></div>
                <div className="px-4 py-2">
                  <p
                    className="text-gray-800 cursor-pointer"
                    onClick={() => handleCopyToClipboard(secretKey)}
                  >
                   🔑 Secret Key: {secretKey}
                  </p>
                  {copySuccess === secretKey && (
                    <div className="text-green-500 text-sm">Copied to clipboard!</div>
                  )}
                </div>
                <div className="border-t border-gray-200 mt-2"></div>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full mt-2"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
