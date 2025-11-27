// Client/src/api.js
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:6060/api'

// create axios instance
const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// helper: set token into default header and localStorage
export function setAuthToken(token) {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`
    try { localStorage.setItem('token', token) } catch (e) { /* ignore */ }
  } else {
    delete API.defaults.headers.common['Authorization']
    try { localStorage.removeItem('token') } catch (e) { /* ignore */ }
  }
}

// attach token from localStorage automatically (on import)
try {
  const stored = localStorage.getItem('token')
  if (stored) API.defaults.headers.common['Authorization'] = `Bearer ${stored}`
} catch (e) {
  // localStorage not available in some environments — ignore
}

export const applyForCard = async (userId, cardType, network, cardName) => {
  try {
    const response = await API.post('/cards/apply', { userId, cardType, network, cardName });
    return response.data;
  } catch (error) {
    console.error("Error applying for card:", error);
    throw error;
  }
};

export const setCardAsPrimary = async (cardId) => {
  const response = await API.post(`/cards/${cardId}/primary`);
  return response.data;
};

export const setCardPin = async (cardId, pin) => {
  const response = await API.post(`/cards/${cardId}/pin`, { pin });
  return response.data;
};

export const getCards = async () => {
  try {
    const response = await API.get('/cards');
    return response.data;
  } catch (error) {
    console.error("Error fetching cards:", error);
    throw error;
  }
};

export const getAllCards = async () => {
  try {
    const response = await API.get('/cards/all');
    return response.data;
  } catch (error) {
    console.error("Error fetching all cards:", error);
    throw error;
  }
};

export default API
