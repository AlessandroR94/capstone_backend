import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageFade from './components/PageFade';

import Home from './pages/Home';
import Games from './pages/Games';
import Xbox from './pages/Xbox';
import PlayStation from './pages/PlayStation';
import Nintendo from './pages/Nintendo';
import RentPage from './pages/RentPage';
import Login from './pages/Login';
import GoogleSuccess from './pages/GoogleSuccess';
import Profile from './pages/Profile';
import MyRentals from './pages/MyRentals';
import Register from './pages/Register';
import RecuperoUsername from './pages/RecuperoUsername';
import RecuperoPassword from './pages/RecuperoPassword';
import ResetPassword from './pages//ResetPassword';
import Wishlist from './pages/Wishlist';



function AppContent() {
  const location = useLocation();

  return (
    <PageFade location={location}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/xbox" element={<Xbox />} />
        <Route path="/games/playstation" element={<PlayStation />} />
        <Route path="/games/nintendo" element={<Nintendo />} />
        <Route path="/rent/:gameId" element={<RentPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-rentals" element={<MyRentals />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recupero-username" element={<RecuperoUsername />} />
        <Route path="/recupero-password" element={<RecuperoPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </PageFade>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <AppContent />
      <Footer />
    </Router>
  );
}
