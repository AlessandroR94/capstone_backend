import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setWishlist([]);
    localStorage.removeItem('user');
    localStorage.removeItem('wishlist');
  };

  const toggleWishlist = (game) => {
    const exists = wishlist.some(item => item._id === game._id);
    const updatedWishlist = exists
      ? wishlist.filter(item => item._id !== game._id)
      : [...wishlist, game];

    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const removeFromWishlist = (id) => {
  const updatedWishlist = wishlist.filter(item => item._id !== id);
  setWishlist(updatedWishlist);
  localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
};


  return (
    <AuthContext.Provider value={{ user, login, logout, wishlist, toggleWishlist, removeFromWishlist }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
