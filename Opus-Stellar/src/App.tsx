import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import StellarAccountCreation from './pages/StellarAcountCreation';
import BuyAsset from './pages/BuyAsset';
import BuyLand from './pages/BuyLand';
import Transaction from './pages/Transactions';
import Invoice from './pages/components/Invoice';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<StellarAccountCreation />} />
        <Route path="/buyAsset" element={<BuyAsset/>} />
        <Route path="/buyLand" element={<BuyLand  />}/>
        <Route path="/transactions" element={<Transaction />} />
        <Route path="/invoice" element={<Invoice publickey='GAXOAKDTMXDPDXTR34ZFANQCIK2EC5WBNRA2AQYJDPXGZQ73COVCVDNJ' blockid='1' transactionhash='adnsakndkansdkasnknaksnda' team='Hufflepuff'/>}/>
      </Routes>
    </Router>
  );
}

export default App;
