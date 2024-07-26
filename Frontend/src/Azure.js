import React, { useState, useEffect } from 'react';
import { createEntity, getEntities, updateEntity, deleteEntity } from './Services/api';

function App() {
  const [entities, setEntities] = useState([]);
  const [newEntity, setNewEntity] = useState({ partitionKey: '', rowKey: '', description: '' });

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    try {
      const response = await getEntities();
      setEntities(response.data);
    } catch (error) {
      console.error('Error fetching entities:', error);
    }
  };

  const handleCreate = async () => {
    try {
      await createEntity(newEntity);
      fetchEntities();
    } catch (error) {
      console.error('Error creating entity:', error);
    }
  };

  const handleUpdate = async (entity) => {
    try {
      await updateEntity(entity);
      fetchEntities();
    } catch (error) {
      console.error('Error updating entity:', error);
    }
  };

  const handleDelete = async (partitionKey, rowKey) => {
    try {
      await deleteEntity({ partitionKey, rowKey });
      fetchEntities();
    } catch (error) {
      console.error('Error deleting entity:', error);
    }
  };

  return (
    <div className="App">
      <h1>Azure Table Storage</h1>
      <div>
        <input
          type="text"
          placeholder="Partition Key"
          value={newEntity.partitionKey}
          onChange={(e) => setNewEntity({ ...newEntity, partitionKey: e.target.value })}
        />
        <input
          type="text"
          placeholder="Row Key"
          value={newEntity.rowKey}
          onChange={(e) => setNewEntity({ ...newEntity, rowKey: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newEntity.description}
          onChange={(e) => setNewEntity({ ...newEntity, description: e.target.value })}
        />
        <button onClick={handleCreate}>Create Entity</button>
      </div>
      <ul>
        {entities.map((entity) => (
          <li key={`${entity.partitionKey}-${entity.rowKey}`}>
            <span>{entity.description}</span>
            <button onClick={() => handleUpdate({ ...entity, description: 'Updated Description' })}>Update</button>
            <button onClick={() => handleDelete(entity.partitionKey, entity.rowKey)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
