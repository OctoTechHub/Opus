import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import StellarAccountCreation from './pages/StellarAcountCreation';
import BuyLand from './pages/BuyLand';
import BuyAsset from './pages/BuyAsset';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StellarAccountCreation />} />
        <Route path="/buyAsset" element={<BuyAsset/>} />
        <Route path="/buyLand" element={<BuyLand/>}/>
      </Routes>
    </Router>
  );
}

export default App;
