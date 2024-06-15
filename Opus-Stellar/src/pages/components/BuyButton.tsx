import React from "react";
import axios from "axios";

interface BuyButtonProps {
  Block: string;
  publickey: string | null;
  privatekey: string | null;
}

const BuyButton: React.FC<BuyButtonProps> = ({ Block, publickey, privatekey }) => {
  const onBuy = async (Block: string) => {
    if (!publickey || !privatekey) {
      console.error("Public key or Private key not found");
      return;
    }
    
    try {
      const response = await axios.post("http://localhost:3000/buy-block", {
        publickey,
        privatekey,
        blockid: Block,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error buying block:", error);
    }
  };

  return (
    <div>
      <button
        className="buy-button bg-slate-900 hover:bg-slate-800 transition duration-200 text-white font-bold px-4 py-2 rounded"
        onClick={() => onBuy(Block)}
        style={{ width: '150px' }}
      >
        Buy Block
      </button>
    </div>
  );
};

export default BuyButton;
