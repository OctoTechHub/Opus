import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import StellarAccountCreation from './pages/StellarAcountCreation';
import Buy from './pages/Buy';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StellarAccountCreation />} />
        <Route path="/buy" element={<Buy />} />
      </Routes>
    </Router>
  );
}

export default App;
