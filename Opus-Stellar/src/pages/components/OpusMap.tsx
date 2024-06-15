import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-toastify/dist/ReactToastify.css';
import StellarSdk from 'stellar-sdk';
import './OpusMap.css';
import BuyButton from './BuyButton';
import allocateBlockID from '../utils/allocateBlockID';
import BlockDetails from './BlockDetailsProps';

interface OpusMapProps {
  publicKey: string;
  privateKey: string;
}

const Sidebar = ({ selectedBlock, onBuy }: { selectedBlock: { id: number; team: string } | null, onBuy: (id: number) => void }) => {
  const publickey = localStorage.getItem("publickey");
  const privatekey = localStorage.getItem("privatekey");

  if (!publickey || !privatekey) {
    toast.error('Private key and public key not found. Please authenticate first.');
    return null;
  }

  return (
    <div className="sidebar">
      {selectedBlock ? (
        <>
          <h2 className="font-bold">Block {selectedBlock.id}</h2>
          <p className="font-bold">Team: {selectedBlock.team}</p>
          <br />
          <BuyButton Block={selectedBlock.id.toString()} publickey={publickey} privatekey={privatekey} />
        </>
      ) : (
        <p>No block selected</p>
      )}
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
      const color = getTeamColor(team);
      const block = L.rectangle(bounds, {
        fillOpacity: 0.8,
        color: color,
        className: team
      }).addTo(map);
      block.on('click', () => handleBlockClick(id, team));
    }

    function getTeamColor(team: string) {
      switch (team) {
        case 'Hufflepuff':
          return 'orange';
        case 'Gryffindor':
          return 'red';
        case 'RavenClaw':
          return 'blue';
        case 'Slytherin':
          return 'green';
        default:
          return 'gray';
      }
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
      const teams = ['Gryffindor', 'Hufflepuff', 'Slytherin', 'RavenClaw'];
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
    const privateKey = localStorage.getItem("privatekey");
    const publicKey = localStorage.getItem("publickey");

    if (privateKey && publicKey) {
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
        toast.error('Transaction failed');
      }
    } else {
      toast.error('Authentication failed: Private key and Public key not found');
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="map-container">
        <div id="map" className="map"></div>
      </div>
      <div className='items-center flex justify-center'>
        {selectedBlock && (
          <Sidebar selectedBlock={selectedBlock} onBuy={handleBuyBlock} />
        )}
      </div>
      <BlockDetails selectedBlock={selectedBlock} onBuy={handleBuyBlock} />
    </>
  );
};

export default OpusMap;
