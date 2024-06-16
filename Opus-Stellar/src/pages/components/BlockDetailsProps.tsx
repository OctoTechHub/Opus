import React, { useEffect, useState } from 'react';
import './blockdetails.css';
import BuyButton from './BuyButton';
import Gryffindor from "../Images/Gryffindor.jpeg";
import Slytherin from "../Images/Slytherin.jpeg";
import RavenClaw from "../Images/RavenClaw.jpeg";
import Hufflepuff from "../Images/Hufflepuff.jpeg";

interface BlockDetailsProps {
  selectedBlock: { id: number; team: string } | null;
 
}

const teamImages: { [key: string]: string } = {
  Gryffindor: Gryffindor,
  Ravenclaw: RavenClaw,
  Slytherin: Slytherin,
  Hufflepuff: Hufflepuff,
};

const BlockDetails: React.FC<BlockDetailsProps> = ({ selectedBlock }) => {
  const [blockImage, setBlockImage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedBlock) {
      const teamImage = teamImages[selectedBlock.team];
      setBlockImage(teamImage);
    }
  }, [selectedBlock]);

  if (!selectedBlock) {
    return (
      <div className="block-details">
        <p>No block selected</p>
      </div>
    );
  }

  return (
    <div className="block-details text-white bg-slate-900 font-mono w-[80%] p-4 rounded flex flex-col items-center ">
      <h2>Block {selectedBlock.id}</h2>
      <p>Team: {selectedBlock.team}</p>
      {blockImage && 
      
      <div className=' w-full'><img src={blockImage} alt={selectedBlock.team} className="mt-2" /> </div>}
      <BuyButton
        Block={selectedBlock.id.toString()}
        publickey={localStorage.getItem('publickey') || ''}
        privatekey={localStorage.getItem('privatekey') || ''}
      />
    </div>
  );
};

export default BlockDetails;