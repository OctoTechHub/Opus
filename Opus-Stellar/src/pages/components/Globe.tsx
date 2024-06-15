import React, { useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import './GlobeComponent.css';
const GlobeComponent: React.FC = () => {
  const [arcsData, setArcsData] = useState<any[]>([]);
  const [title, setTitle] = useState<string>('Welcome to Opus-Stellar!');

  useEffect(() => {
    const N = 80;
    const data = [...Array(N).keys()].map(() => ({
      startLat: (Math.random() - 0.5) * 180,
      startLng: (Math.random() - 0.5) * 360,
      endLat: (Math.random() - 0.5) * 180,
      endLng: (Math.random() - 0.5) * 360,
      color: [['red', 'yellow', 'blue', 'purple'][Math.floor(Math.random() * 4)], ['red', 'yellow', 'blue', 'purple'][Math.floor(Math.random() * 4)]]
    }));
    setArcsData(data);
  }, []);

  return (
    <div className="globe-container">
      <div className="globe-title text-center ">
        <p className='text-3xl'>

          {title}
        </p>
        <p className='text-md '>Enter into the World of Virtual Estate</p>
      </div>
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        arcsData={arcsData}
        arcColor={'color'}
        arcDashLength={() => Math.random()}
        arcDashGap={() => Math.random()}
        arcDashAnimateTime={() => Math.random() * 4000 + 500}
      />
    </div>
  );
};

export default GlobeComponent;
