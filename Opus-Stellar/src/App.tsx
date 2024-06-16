import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import StellarAccountCreation from './pages/StellarAcountCreation';
import BuyAsset from './pages/BuyAsset';
import BuyLand from './pages/BuyLand';
import Transaction from './pages/Transactions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<StellarAccountCreation />} />
        <Route path="/buyAsset" element={<BuyAsset/>} />
        <Route path="/buyLand" element={<BuyLand  />}/>
        <Route path="/transactions" element={<Transaction />} />
      </Routes>
    </Router>
  );
}

export default App;
