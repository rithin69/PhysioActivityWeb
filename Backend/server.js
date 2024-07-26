const express = require('express');
const cors = require('cors');
const { TableServiceClient, TableClient, AzureNamedKeyCredential, odata } = require("@azure/data-tables");

const app = express();
const port = 3001;
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Configuration for Azure Table Storage
const endpoint = "https://exerciseslib.table.core.windows.net";
const credential = new AzureNamedKeyCredential(
  "exerciseslib",
  "B4Tcdvw2f5VroXkNlYRB0Dg9OJZ98wpczpzxKRaecaAzrol7pITHgzI+uKsWwV9nFVUORluOeTam+AStEOgUiQ=="
);

const tableService = new TableServiceClient(endpoint, credential);
const tableClient = new TableClient(endpoint, 'sbxPhysioActivity', credential);

// Create a new table if it doesn't exist
tableService.createTable('sbxPhysioActivity').catch(console.error);

// Define CRUD API routes

// Create an entity
app.post('/entity', async (req, res) => {
  const entity = req.body;
  try {
    await tableClient.createEntity(entity);
    res.status(201).send('Entity created');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Read entities
app.get('/entities', async (req, res) => {
  try {
    const entities = tableClient.listEntities();
    const result = [];
    for await (const entity of entities) {
      result.push(entity);
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update an entity
app.put('/entity', async (req, res) => {
  const entity = req.body;
  try {
    await tableClient.upsertEntity(entity, "Replace");
    res.status(200).send('Entity updated');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete an entity
app.delete('/entity', async (req, res) => {
  const { partitionKey, rowKey } = req.body;
  try {
    await tableClient.deleteEntity(partitionKey, rowKey);
    res.status(200).send('Entity deleted');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
