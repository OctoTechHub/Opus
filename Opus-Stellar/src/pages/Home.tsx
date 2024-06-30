import React from 'react';
import GlobeComponent from './components/Globe'; 
import Navbar from './components/Navbar';
import Footer from './components/footer';

const Home: React.FC = () => {
  return (
      <>
      <Navbar/>
      <GlobeComponent />
      <Footer/>
</>
  );
};

export default Home;