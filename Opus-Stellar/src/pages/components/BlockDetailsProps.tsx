import React from 'react';
import { blockImages } from './blockImages';
import './blockdetails.css';
import BuyButton from './BuyButton';

interface BlockDetailsProps {
  selectedBlock: { id: number; team: string } | null;
  onBuy: (id: number) => void;
}

const BlockDetails: React.FC<BlockDetailsProps> = ({ selectedBlock, onBuy }) => {
  if (!selectedBlock) {
    return (
      <div className="block-details">
        <p>No block selected</p>
      </div>
    );
  }

  const blockImage = blockImages[selectedBlock.team];

  return (
    <div className="block-details bg-slate-300 font-mono hover:bg-slate-100 transition duration-200">
      <h2>Block {selectedBlock.id}</h2>
      <p>Team: {selectedBlock.team}</p>
      {blockImage && <img src={blockImage} alt={selectedBlock.team} />}
      <BuyButton
        Block={selectedBlock.id.toString()}  
        publickey={localStorage.getItem('publickey') || null}  
        privatekey={localStorage.getItem('privatekey') || null} 
      />
    </div>
  );
};

export default BlockDetails;
