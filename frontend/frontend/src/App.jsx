import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Games from './pages/Games';
import Xbox from './pages/Xbox';
import PlayStation from './pages/PlayStation';

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/xbox" element={<Xbox />} />
        <Route path="/games/playstation" element={<PlayStation />} />
      </Routes>
    </Router>
  );
}

export default App;
