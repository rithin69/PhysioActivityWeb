import axios from 'axios';

// Create an Axios instance with your server's URL
const api = axios.create({
  baseURL: 'http://localhost:3001', // Your Node.js server URL
});

// Define functions to make requests to your server
export const createEntity = (entity) => api.post('/entity', entity);
export const getEntities = () => api.get('/entities');
export const updateEntity = (entity) => api.put('/entity', entity);
export const deleteEntity = (keys) => api.delete('/entity', { data: keys });

export default api; // Export the Axios instance
