import React from 'react';
import axios from 'axios';
import './blockdetails.css';
import { useToast } from '../../ToastContext';

interface BuyButtonProps {
  Block: string;
  publickey: string | null;
  privatekey: string | null;
}

const BuyButton: React.FC<BuyButtonProps> = ({ Block, publickey, privatekey }) => {
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
      showToast(`Block ${Block} purchased successfully!`);
    } catch (error) {
      console.error("Error buying block:", error);
      showToast('Error buying block', 'error');
    }
  };

  return (
    <div className="text-white">
      <button
        className="buy-button bg-slate-800 font-bold px-4 py-2 rounded text-black hover:bg-gray-400"
        onClick={() => onBuy(Block)}
        style={{ width: '150px' }}
      >
        Buy Block
      </button>
    </div>
  );
};

export default BuyButton;
