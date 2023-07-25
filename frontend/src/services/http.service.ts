import axios from 'axios';

const ApiUrl = import.meta.env.VITE_APP_SOCKET_URL as string;

const api = axios.create({
  baseURL: ApiUrl,
  withCredentials: true,
});

export default api;