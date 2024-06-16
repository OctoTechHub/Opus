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
      maxZoom: 16,
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

    function createBlock(lat:any, lng:any, id:any, team:any) {
      const bounds: L.LatLngBoundsLiteral = [
        [lat, lng],
        [lat + blockSize, lng + blockSize]
      ];
      const color = getTeamColor(team);
      const block = L.rectangle(bounds, {
        fillOpacity: 0.4,
        color: color,
        weight:2,
        className: team
      }).addTo(map);
      block.on('click', () => handleBlockClick(id, team));
    }

    function getTeamColor(team:string) {
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

    function handleBlockClick(id:any, team:any) {
      setSelectedBlock({ id, team });
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

      <BlockDetails selectedBlock={selectedBlock} onBuy={handleBuyBlock} />
    </>
  );
};

export default OpusMap;
