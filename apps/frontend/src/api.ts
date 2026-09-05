import axios from 'axios';

const API_BASE_URL = 'https://project-reflexx-kqzkdqd9z-iminyibrooks-bots-projects.vercel.app';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchOrdersSafely = async () => {
  try {
    const res = await api.get('/api/orders');
    const data = res.data;
    const ordersList = Array.isArray(data) 
      ? data 
      : Array.isArray(data?.data) 
        ? data.data 
        : [];
    return { orders: ordersList, isOnline: true };
  } catch (err) {
    return { orders: [], isOnline: false };
  }
};

export default api;

