import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Globe from 'react-globe.gl';
import './GlobeComponent.css';

const GlobeComponent: React.FC = () => {
  const [arcsData, setArcsData] = useState<any[]>([]);
  const [title] = useState<string>('Welcome to Fantility!');
  const navigate = useNavigate();

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

  const handleGetStarted = () => {
    navigate('/create');
  };

  return (
    <div className="globe-container">
      <div className="globe-title text-center ">
        <p className='text-6xl font-mono'>
          {title}
        </p>
        <p className='text-2xl font-semibold mt-4 font-mono'>your go-to fandom based virtual experience platform</p>
        <button className="bg-orange-500 hover:bg-orange-700 text-white font-mono py-2 px-4 mt-4 rounded"
                onClick={handleGetStarted}>
          Get Started Today
        </button>
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
