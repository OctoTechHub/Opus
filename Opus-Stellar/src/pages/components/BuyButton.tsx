import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './blockdetails.css';
import { useToast } from '../../ToastContext';
import Invoice from './Invoice';
import { useNavigate } from 'react-router-dom';

interface BuyButtonProps {
  Block: string;
  publickey: string | null;
  privatekey: string | null;
  teamName: string;
}

const BuyButton: React.FC<BuyButtonProps> = ({ Block, publickey, privatekey,teamName }) => {
  const navigate=useNavigate();
  const[success, setSuccess] = useState(false);
  const[thash,setthash]=useState('');
  useEffect(()=>{
    const fetchTransactionData=async(transactionHash:string)=>{
      try{
        const response=await fetch(`https://horizon-testnet.stellar.org/transactions/`+transactionHash);
        const responseJSON=await response.json()
      }
      catch(error){
        console.error('Error fetching transaction data:',error);
      }
    }
  },[success])
  const { showToast } = useToast();
  const onBuy = async (Block: string) => {
    if (!publickey || !privatekey) {
      console.error("Public key or Private key not found");
      showToast('Public key or Private key not found', 'error');
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/buy-block", {
        publickey,
        privatekey,
        blockid: Block,
      });
      console.log(response.data);
      localStorage.setItem('transactionhash',response.data.transaction.hash);
      setSuccess(true);
      showToast(`Block ${Block} purchased successfully!`);
    } catch (error) {
      console.error("Error buying block:", error);
      showToast('Error buying block', 'error');
    }
  };

  return (
    <div className="text-white">
      {!success&&(<button
        className="buy-button bg-orange-500 hover:bg-orange-500 font-bold px-4 py-2 rounded text-black \"
        onClick={() => onBuy(Block)}
        style={{ width: '150px' }}
      >
        Buy Block
      </button>)}
      {success && (
        <button className='bg-orange-500 hover:bg-orange-700 font-bold px-4 py-2 rounded text-black' onClick={()=>{
          navigate('/invoice',{
            state:{
              blockid:Block,
              publickey:localStorage.getItem('publickey'),
              transactionhash:localStorage.getItem('transactionhash'),
              team:teamName
            }
          })
        }}>
          Check Invoice
        </button>
      )}  
    </div>
  );
};

export default BuyButton;
