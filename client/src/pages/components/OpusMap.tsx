import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import './OpusMap.css';

const OpusMap: React.FC = () => {
  const [selectedBlock, setSelectedBlock] = useState<{ id: number; team: string } | null>(null);

  useEffect(() => {
    const map = L.map('map').setView([40.7128, -74.0060], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    const blockSize = 0.001;
    const blocksBounds: L.LatLngBoundsLiteral = [[40.70, -74.02], [40.75, -73.97]];

    // Create a mask layer covering the entire map
    const maskBounds: L.LatLngBoundsLiteral = [
      [blocksBounds[0][0], blocksBounds[0][1]],
      [blocksBounds[1][0], blocksBounds[1][1]]
    ];
    

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
    };
  }, []);

  return (
    <div style={{ display: 'flex', height: '50vh' }}>
      <div id="map" style={{ flex: 1 }}></div>
      {selectedBlock && (
        <Sidebar selectedBlock={selectedBlock} />
      )}
    </div>
  );
};

const Sidebar = ({ selectedBlock }: { selectedBlock: { id: number; team: string } }) => {
  return (
    <div
      style={{
        width: 300,
        backgroundColor: 'white',
        padding: 20,
        borderLeft: '1px solid #ddd'
      }}
    >
      <h2>Block {selectedBlock.id}</h2>
      <p>Team: {selectedBlock.team}</p>
      <button>Buy</button>
      <button>Sell</button>
    </div>
  );
};

export default OpusMap;
