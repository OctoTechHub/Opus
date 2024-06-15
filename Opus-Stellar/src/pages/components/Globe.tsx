import React, { useEffect, useState } from 'react';
import Globe from 'react-globe.gl';

const GlobeComponent: React.FC = () => {
  const [arcsData, setArcsData] = useState<any[]>([]);

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
    <>
      <h1>My Globe Component</h1>
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        arcsData={arcsData}
        arcColor={'color'}
        arcDashLength={() => Math.random()}
        arcDashGap={() => Math.random()}
        arcDashAnimateTime={() => Math.random() * 4000 + 500}
      />
    </>
  );
};

export default GlobeComponent;