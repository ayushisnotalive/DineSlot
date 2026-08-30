import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? 'https://dineslot-production-5dfd.up.railway.app/api' 
    : 'http://localhost:5000/api', // Adjust local backend port if needed
  withCredentials: true, // Important for cookies
});

export default api;
