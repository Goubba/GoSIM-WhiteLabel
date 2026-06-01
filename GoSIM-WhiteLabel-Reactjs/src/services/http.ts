import axios from 'axios';

const http = axios.create({
  baseURL: 'https://business.getgosim.com/api/v1/vendor',
});

http.interceptors.request.use((config) => {
  const key = sessionStorage.getItem('api-key');
  const customHost = sessionStorage.getItem('host');
  
  if (key) {
    config.headers['api-key'] = key;
  }
  
  if (customHost) {
    config.baseURL = customHost;
  }
  
  return config;
});

export default http;
