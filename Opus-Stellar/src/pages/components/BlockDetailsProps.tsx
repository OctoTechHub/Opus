import React from 'react';
import { blockImages } from './blockImages';
import './blockdetails.css';

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
    <div className="block-details">
      <h2>Block {selectedBlock.id}</h2>
      <p>Team: {selectedBlock.team}</p>
      {blockImage && <img src={blockImage} alt={selectedBlock.team} />}
      <button onClick={() => onBuy(selectedBlock.id)}>Buy</button>
      <button>Sell</button>
    </div>
  );
};

export default BlockDetails;
