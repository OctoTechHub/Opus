import React, { useState, useEffect } from 'react';
import { Keypair } from '@stellar/stellar-sdk';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// const StellarAccountCreation: React.FC = () => {
//   const [keypair, setKeypair] = useState<Keypair | null>(null);
//   const [fundingStatus, setFundingStatus] = useState(false);
//   const [fundingResult, setFundingResult] = useState(false);
//   const [balance, setBalance] = useState<string | null>(null);
//   const [loadingGenerate, setLoadingGenerate] = useState(false);
//   const [loadingFetch, setLoadingFetch] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://cdnjs.cloudflare.com/ajax/libs/stellar-sdk/10.1.1/stellar-sdk.min.js';
//     document.body.appendChild(script);
//   }, []);

//   const handleGenerateKeypair = () => {
//     setLoadingGenerate(true);
//     const pair = Keypair.random();
//     setKeypair(pair);
//     localStorage.setItem('publickey', pair.publicKey());
//     localStorage.setItem('secretkey', pair.secret());
//     setLoadingGenerate(false);
//   };

//   const handleFundAccount = async () => {
//     if (!keypair) return;
//     setFundingStatus(true);
//     try {
//       const response = await fetch(`https://friendbot.stellar.org?addr=${keypair.publicKey()}`);
//       if (response.ok) {
//         setFundingResult(true);
//         navigate('/buyLand', { state: { publicKey: keypair.publicKey() } });
//         downloadKeyPairAsTextFile(keypair);
//       } else {
//         throw new Error('Failed to fund account');
//       }
//     } catch (error: any) {
//       setFundingStatus(false);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   const handleFetchBalance = async () => {
//     setLoadingFetch(true);
//     if (!keypair) return;
//     try {
//       const response = await axios.get(`https://horizon-testnet.stellar.org/accounts/${keypair.publicKey()}`);
//       setBalance(response.data.balances[0].balance);
//     } catch (error: any) {
//       setBalance(`Error: ${error.message}`);
//     }
//     setLoadingFetch(false);
//   };


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex justify-center items-center">
//       <div className="max-w-xl mx-auto p-8 rounded-lg bg-white shadow-lg">
//         <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
//           Stellar Account Creation<br />
//           <span className="text-lg font-normal">Join Opus and buy your virtual land</span>
//         </h1>
//         <div className="flex justify-center mb-4">
//           {/* <button
//             className={`bg-orange-500 text-white py-2 px-4 rounded-md mr-10 ${loadingGenerate ? 'opacity-50 cursor-not-allowed' : ''}`}
//             onClick={handleGenerateKeypair}
//             disabled={loadingGenerate}
//           >
//             {loadingGenerate ? 'Generating...' : 'Generate Key Pair'}
//           </button> */}
//           {keypair && (
//             <div id="keypair">
//               <p>
//                 <strong>Public Key:</strong> <span className="font-mono mr-20">{keypair.publicKey()}</span>
//               </p>
//               <p>
//                 <strong>Secret Key:</strong> <span className="font-mono">{keypair.secret()}</span>
//               </p>
//               {/* <button
//                 className={`bg-orange-500 text-white py-2 px-4 rounded-md mt-6 ${loadingFetch ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 onClick={handleFundAccount}
//                 disabled={loadingFetch}
//               >
//                 {loadingFetch ? 'Funding...' : 'Fund Account'}
//               </button> */}
//             </div>
//           )}
//         </div>
//         {fundingStatus && (
//           <div id="funding-status" className="text-center mb-4">
//             <p>Funding account...</p>
//           </div>
//         )}
//         {fundingResult && (
//           <div id="funding-result" className="text-center mb-4">
//             <p>Account funded successfully!</p>
//           </div>
//         )}
//         <div className="flex justify-center mb-4">
//           <button
//             className={`bg-orange-500 text-white py-2 px-4 rounded-md ml-4 mr-2 ${loadingFetch ? 'opacity-50 cursor-not-allowed' : ''}`}
//             onClick={handleFetchBalance}
//             disabled={loadingFetch}
//           >
//             {loadingFetch ? 'Fetching...' : 'Fetch Balance'}
//           </button>
//           <p className=" mt-2 text-center  text-gray-800" id="balance">{balance !== null ? `${balance} XLMs` : 'Balance: -'}</p>
//         </div>
//       </div>
//     </div>
//   );
// };
const StellarAccountCreation = () => {
  const [privatekey, setprivatekey] = useState('');
  const [publickey, setpublickey] = useState('');
  const[keypair,setkeypair]=useState<Keypair | null>(null);
  const [generated, setGenerated] = useState(false); // Add state for generated keys
  const navigate = useNavigate();
  const handlechange = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
    if (value === 'publickey') {
      setpublickey(e.target.value);
    } else {
      setprivatekey(e.target.value);
    }
  };

  const handleSubmit = () => {
    if(!publickey || !privatekey) return;
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
    setGenerated(true); // Set generated state to true
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
    navigate('/buyAsset')
  }


  return (
    <div className="flex justify-center w-screen bg-black items-center h-screen">
      <div className="flex bg-blue-600 text-white rounded-lg px-5 py-10 gap-5 justify-center flex-col text-center">
        <h1>Stellar Account Creation</h1>
        <p>Join Opus and buy your virtual land</p>
        <input
          onChange={(e) => handlechange(e, 'publickey')}
          id="publickey"
          type="text"
          placeholder="Enter Public Key"
          className="px-3 py-2 text-black bg-white rounded-lg"
        />
        <input
          onChange={(e) => handlechange(e, 'privatekey')}
          id="privatekey"
          type="text"
          placeholder="Enter Private Key"
          className="px-3 py-2 bg-white text-black rounded-lg"
        />
        <button onClick={handleSubmit} className="px-2 py-2 rounded-lg bg-slate-800">Enter to MetaVerse</button>
        <button onClick={handleGenerate} className='px-2 py-2 rounded-lg bg-slate-800 '>New to MetaVerse?
          Create Account
        </button>
        {generated && (
          <div className='text-wrap'> {/* Add text-wrap class to wrap the text */}
            <p>
              <strong>Public Key:</strong> {publickey}
            </p>
            <p>
              <strong>Private Key:</strong> {privatekey}
            </p>
            <button onClick={handledownloadclick} className='px-2 py-2 rounded-lg bg-slate-800'>
              Click here to download your KeyPair
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default StellarAccountCreation;
