require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { TableServiceClient, TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");
const { ConfidentialClientApplication } = require('@azure/msal-node');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for frontend
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// -------------------
// Azure Table Storage Configuration
// -------------------
const tableEndpoint = process.env.TABLE_ENDPOINT;
const tableCredential = new AzureNamedKeyCredential(
  process.env.TABLE_ACCOUNT_NAME,
  process.env.TABLE_ACCOUNT_KEY
);

const tableService = new TableServiceClient(tableEndpoint, tableCredential);
const tableClient = new TableClient(tableEndpoint, process.env.TABLE_NAME, tableCredential);

// Create a new table if it doesn't exist
tableService.createTable(process.env.TABLE_NAME).catch(console.error);

// -------------------
// Power BI Configuration
// -------------------
const powerBiConfig = {
  clientId: process.env.POWER_BI_CLIENT_ID,
  clientSecret: process.env.POWER_BI_CLIENT_SECRET,
  tenantId: process.env.POWER_BI_TENANT_ID,
  authorityUrl: process.env.POWER_BI_AUTHORITY_URL,
  scopeBase: process.env.POWER_BI_SCOPE_BASE,
  workspaceId: process.env.POWER_BI_WORKSPACE_ID,
  reportId: process.env.POWER_BI_REPORT_ID,
  powerBiApiUrl: process.env.POWER_BI_API_URL
};

const msalConfig = {
  auth: {
    clientId: powerBiConfig.clientId,
    authority: `${powerBiConfig.authorityUrl}${powerBiConfig.tenantId}`,
    clientSecret: powerBiConfig.clientSecret
  }
};

const cca = new ConfidentialClientApplication(msalConfig);

// Helper function to get the Azure AD access token
const getPowerBiAccessToken = async () => {
  const tokenResponse = await cca.acquireTokenByClientCredential({
    scopes: [powerBiConfig.scopeBase]
  });
  return tokenResponse.accessToken;
};

// Power BI Route: Generate Embed Token
app.get('/api/getEmbedToken', async (req, res) => {
  try {
    const accessToken = await getPowerBiAccessToken();

    const embedTokenResponse = await axios.post(
      `${powerBiConfig.powerBiApiUrl}v1.0/myorg/groups/${powerBiConfig.workspaceId}/reports/${powerBiConfig.reportId}/GenerateToken`,
      { accessLevel: 'view' },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${powerBiConfig.reportId}&groupId=${powerBiConfig.workspaceId}`,
      embedToken: embedTokenResponse.data.token
    });
  } catch (error) {
    console.error('Error generating embed token:', error.response ? error.response.data : error);
    res.status(error.response?.status || 500).send('Error generating embed token');
  }
});

// -------------------
// Azure Table Storage CRUD Operations
// -------------------

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

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});