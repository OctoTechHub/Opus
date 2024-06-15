import React from 'react';
import GlobeComponent from './components/Globe'; 
import Navbar from './components/Navbar';

const Home: React.FC = () => {
  return (
    <div>
      <Navbar/>
      <GlobeComponent />
    </div>
  );
};

export default Home;