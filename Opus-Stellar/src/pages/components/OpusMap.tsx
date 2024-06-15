import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import StellarSdk from 'stellar-sdk';
import './OpusMap.css';
import BuyButton from './BuyButton';
import allocateBlockID from '../utils/allocateBlockID';

interface OpusMapProps {
  publicKey: string;
  privateKey: string; 
}

const Sidebar = ({ selectedBlock, onBuy }: { selectedBlock: { id: number; team: string }, onBuy: (id: number) => void }) => {
  const publickey=localStorage.getItem("publickey");
  const privatekey=localStorage.getItem("privatekey");
  const blockid=selectedBlock.id.toString()
  return (
    <div className="sidebar ">
      <h2>Block {selectedBlock.id}</h2>
      <p>Team: {selectedBlock.team}</p>
      <BuyButton Block={blockid} publickey={publickey} privatekey={privatekey}/>
    </div>
  );
};

const OpusMap: React.FC<OpusMapProps> = ({ publicKey, privateKey }) => {
  const [selectedBlock, setSelectedBlock] = useState<{ id: number; team: string } | null>(null);
  const [ownership, setOwnership] = useState<{ [key: number]: string }>({});
  const [user, setUser] = useState<{ publicKey: string; privateKey: string; ownedBlocks: number[] }>({
    publicKey,
    privateKey,
    ownedBlocks: []
  });

  useEffect(() => {
    const map = L.map('map').setView([40.7128, -74.0060], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    const blockSize = 0.001;
    const blocksBounds: L.LatLngBoundsLiteral = [[40.70, -74.02], [40.75, -73.97]];

    const mask = L.rectangle(blocksBounds, {
      fillOpacity: 0,
      weight: 0,
      interactive: false,
    }).addTo(map);

    function createBlock(lat: number, lng: number, id: number, team: string) {
      const bounds: L.LatLngBoundsLiteral = [
        [lat, lng],
        [lat + blockSize, lng + blockSize]
      ];
      const block = L.rectangle(bounds, {
        fillOpacity: 0.3,
        className: team
      }).addTo(map);
      block.on('click', () => handleBlockClick(id, team));
    }

    function handleBlockClick(id: number, team: string) {
      setSelectedBlock({ id, team });
    }

    let id = 1;
    for (let lat = 40.70; lat < 40.75; lat += blockSize) {
      for (let lng = -74.02; lng < -73.97; lng += blockSize) {
        const team = getRandomTeam();
        createBlock(lat, lng, id, team);
        id++;
      }
    }

    function getRandomTeam() {
      const teams = ['Gryffindor', 'Hufflepuff', 'Slytherin', 'RavenClaw', 'Yates'];
      return teams[Math.floor(Math.random() * teams.length)];
    }

    map.fitBounds(blocksBounds);

    map.on('dragend', () => {
      const center = map.getCenter();
      const nearestBlockLat = Math.round(center.lat / blockSize) * blockSize;
      const nearestBlockLng = Math.round(center.lng / blockSize) * blockSize;
      map.panTo([nearestBlockLat, nearestBlockLng]);
    });

    return () => {
      map.remove();
      mask.remove();
    };
  }, []);

  const handleBuyBlock = async (id: number) => {
    if (privateKey) {
      try {
        await allocateBlockID(id.toString(), privateKey, 'NewDollar', 'GA2XMHHFMN3NDSG5BLQYTDIYFYHBRQFYJ4DZKKBI7JDVIVPIVHVNA2ND', '10');
        setOwnership(prevOwnership => ({
          ...prevOwnership,
          [id]: publicKey
        }));
        setUser(prevUser => ({
          ...prevUser,
          ownedBlocks: [...prevUser.ownedBlocks, id]
        }));
        if (selectedBlock) {
          setSelectedBlock({ ...selectedBlock, team: publicKey });
        }
      } catch (error: any) {
        console.error('Transaction failed:', error.response?.data || error.message);
        alert('Transaction failed');
      }
    } else {
      alert('Authentication failed');
    }
  };

  return (
    <>
    <div className="map-container">
      <div id="map" className="map"></div>
      <div className='mt-10'>
        
      </div>
    </div>
    
    <div className='items-center flex justify-center'>
          {selectedBlock && (
            <Sidebar selectedBlock={selectedBlock} onBuy={handleBuyBlock} />
          )}
        </div>  
    </>
  );
};

export default OpusMap;
