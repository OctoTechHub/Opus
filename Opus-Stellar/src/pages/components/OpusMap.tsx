import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import './OpusMap.css';

interface OpusMapProps {
  publicKey: string;
  secretKey: string;
}

const Sidebar = ({ selectedBlock, onBuy }: { selectedBlock: { id: number; team: string }, onBuy: (id: number) => void }) => {
  return (
    <div className="sidebar">
      <h2>Block {selectedBlock.id}</h2>
      <p>Team: {selectedBlock.team}</p>
      <button onClick={() => onBuy(selectedBlock.id)}>Buy</button>
      <button>Sell</button>
    </div>
  );
};

const OpusMap: React.FC<OpusMapProps> = ({ publicKey, secretKey }) => {
  const [selectedBlock, setSelectedBlock] = useState<{ id: number; team: string } | null>(null);
  const [ownership, setOwnership] = useState<{ [key: number]: string }>({});
  const [user, setUser] = useState<{ publicKey: string; secretKey: string; ownedBlocks: number[] }>({
    publicKey,
    secretKey,
    ownedBlocks: []
  });

  useEffect(() => {
    const map = L.map('map').setView([40.7128, -74.0060], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    const blockSize = 0.001;
    const blocksBounds: L.LatLngBoundsLiteral = [[40.70, -74.02], [40.75, -73.97]];

    // Create a mask layer covering the entire map
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
      const teams = ['avengers', 'xmen', 'spiderman', 'ironman', 'captainamerica'];
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

  const handleBuyBlock = (id: number) => {
    if (secretKey) {  // Simplified authentication check
      setOwnership((prevOwnership) => ({
        ...prevOwnership,
        [id]: publicKey
      }));
      setUser((prevUser) => ({
        ...prevUser,
        ownedBlocks: [...prevUser.ownedBlocks, id]
      }));
      if (selectedBlock) {
        setSelectedBlock({ ...selectedBlock, team: publicKey });
      }
    } else {
      alert('Authentication failed');
    }
  };

  return (
    <div className="map-container">
      <div id="map" className="map"></div>
      {selectedBlock && (
        <Sidebar selectedBlock={selectedBlock} onBuy={handleBuyBlock} />
      )}
    </div>
  );
};

export default OpusMap;