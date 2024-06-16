import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-toastify/dist/ReactToastify.css';
import StellarSdk from 'stellar-sdk';
import './OpusMap.css';
import allocateBlockID from '../utils/allocateBlockID';
import BlockDetails from './BlockDetailsProps';

interface OpusMapProps {
  publicKey: string;
  privateKey: string;
}

const OpusMap: React.FC<OpusMapProps> = ({ publicKey, privateKey }) => {
  const [selectedBlock, setSelectedBlock] = useState<{ id: number; team: string } | null>(null);
  const [ownership, setOwnership] = useState<{ [key: number]: string }>({});
  const [user, setUser] = useState<{ publicKey: string; privateKey: string; ownedBlocks: number[] }>({
    publicKey,
    privateKey,
    ownedBlocks: []
  });

  useEffect(() => {
    const map = L.map('map').setView([22.30992420772124, 73.179856870333], 4);
    var Stadia_StamenWatercolor = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg', {
      minZoom: 1,
      maxZoom: 15,
      attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    Stadia_StamenWatercolor.addTo(map);

    const blockSize = 0.001;
    const blocksBounds: L.LatLngBoundsLiteral = [[22.30992420772124, 73.179856870333], [22.50992420772124, 73.379856870333]];
    const mask = L.rectangle(blocksBounds, {
      fillOpacity: 0,
      weight: 0,
      interactive: false,
    }).addTo(map);

    function createBlock(lat: any, lng: any, id: any, team: any) {
      const bounds: L.LatLngBoundsLiteral = [
        [lat, lng],
        [lat + blockSize, lng + blockSize]
      ];
      const color = getTeamColor(team);
      const block = L.rectangle(bounds, {
        fillOpacity: 0.4,
        color: color,
        weight: 2,
        className: team
      }).addTo(map);
      block.on('click', () => handleBlockClick(lat, lng, id, team)); // Pass lat, lng, id, team to handler
    }

    function getTeamColor(team: string) {
      switch (team) {
        case 'Hufflepuff':
          return 'orange';
        case 'Gryffindor':
          return 'red';
        case 'Ravenclaw':
          return 'blue';
        case 'Slytherin':
          return 'green';
        default:
          return 'gray';
      }
    }

    function handleBlockClick(lat: any, lng: any, id: any, team: any) {
      setSelectedBlock({ id, team });
      map.flyToBounds([[lat, lng], [lat + blockSize, lng + blockSize]]);
    }

    let id = 1;
    for (let lat = 22.305; lat < 22.325; lat += blockSize) {
      for (let lng = 73.175; lng < 73.225; lng += blockSize) {
        const team = getRandomTeam();
        createBlock(lat, lng, id, team);
        id++;
      }
    }

    function getRandomTeam() {
      const teams = ['Gryffindor', 'Hufflepuff', 'Slytherin', 'Ravenclaw'];
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

 

  return (
    <div className='w-screen'>
      <div className="opus-map-container">
        <ToastContainer />
        <div className="map-container mr-10">
          <div id="map" className="map"></div>
        </div>
        <div className="block-details-container">
          <BlockDetails selectedBlock={selectedBlock}/>
        </div>
      </div>
    </div>
  );
};

export default OpusMap;
