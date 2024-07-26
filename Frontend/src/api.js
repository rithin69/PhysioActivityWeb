import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Your Node.js server URL
});

export const createEntity = (entity) => api.post('/entity', entity);
export const getEntities = () => api.get('/entities');
export const updateEntity = (entity) => api.put('/entity', entity);
export const deleteEntity = (keys) => api.delete('/entity', { data: keys });

export default api;
