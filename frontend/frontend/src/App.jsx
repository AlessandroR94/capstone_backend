import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Games from './pages/Games';
import Xbox from './pages/Xbox';
import PlayStation from './pages/PlayStation';
import RentPage from './pages/RentPage';
import Login from './pages/Login';
import GoogleSuccess from './pages/GoogleSuccess';
import Profile from './pages/Profile';
import MyRentals from './pages/MyRentals';
import Register from './pages/Register';
import RecuperoUsername from './pages/RecuperoUsername';
import RecuperoPassword from './pages/RecuperoPassword';

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/xbox" element={<Xbox />} />
        <Route path="/games/playstation" element={<PlayStation />} />
        <Route path="/rent/:gameId" element={<RentPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-rentals" element={<MyRentals />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recupero-username" element={<RecuperoUsername />} />
        <Route path="/recupero-password" element={<RecuperoPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
