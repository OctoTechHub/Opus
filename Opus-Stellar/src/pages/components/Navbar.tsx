import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../../public/173474766.png';

const Navbar = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [optokens, setOptokens] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedPublicKey = localStorage.getItem('publickey');
    const storedPrivateKey = localStorage.getItem('privatekey');
    const storedOptokens = localStorage.getItem('optokens');
    if (storedPublicKey) {
      setPublicKey(storedPublicKey);
    }
    if (storedPrivateKey) {
      setPrivateKey(storedPrivateKey);
    }
    if (storedOptokens) {
      setOptokens(parseInt(storedOptokens, 10));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('publickey');
    localStorage.removeItem('privatekey');
    localStorage.removeItem('optokens');
    navigate('/');
  };

  const handleCopyToClipboard = async (key: string, keyType: string) => {
    try {
      await navigator.clipboard.writeText(key);
      toast.success(`${keyType} copied to clipboard!`);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy. Please try again.');
    }
  };

  const isKeysRecognized = publicKey && privateKey;

  return (
    <nav className="bg-black text-white shadow-md py-4 font-mono">
      <ToastContainer />
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo" className="h-8 mr-2" /> Fantility
          </Link>
          {location.pathname === '/' && (
            <button
              onClick={() => navigate('/transactions')}
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold font-mono py-2 px-4 rounded"
            >
              See Live Transactions
            </button>
          )}
          {isKeysRecognized && location.pathname !== '/' && location.pathname !== '/create' && (
            <div className="relative">
              <button
                className="bg-orange-500 hover:bg-orange-700 text-white font-mono font-bold py-2 px-4 rounded focus:outline-none"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                Profile
              </button>
              {showProfileDropdown && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded shadow-md py-2 border border-gray-200"
                  onClick={() => setShowProfileDropdown(false)}
                >
                  <div className="px-4 py-2">
                    <p
                      className="text-gray-800 cursor-pointer hover:text-blue-500 font-mono"
                      onClick={() => handleCopyToClipboard(publicKey, 'Public Key')}
                    >
                      👥 Public Key: ************
                    </p>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <p
                      className="text-gray-800 cursor-pointer hover:text-blue-500 font-mono"
                      onClick={() => handleCopyToClipboard(privateKey, 'Private Key')}
                    >
                      🔑 Private Key: ************
                    </p>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <p className="text-gray-800 font-mono">🪙 OP Tokens: {optokens}</p>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full font-mono"
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
