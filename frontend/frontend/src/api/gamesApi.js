import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/games';

export const fetchGames = async (platform = null) => {
  if (!platform) {
    // Se non è specificata una piattaforma, prendi sia Xbox che PlayStation
    const [xboxRes, psRes, nintendoRes] = await Promise.all([
      axios.get(`${BASE_URL}/xbox`),
      axios.get(`${BASE_URL}/playstation`),
      axios.get(`${BASE_URL}/nintendo`)
    ]);

    return [...xboxRes.data, ...psRes.data, ...nintendoRes.data];
  } else {
    const res = await axios.get(`${BASE_URL}/${platform}`);
    return res.data;
  }
};
