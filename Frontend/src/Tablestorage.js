// src/services/tableStorage.js
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { config } from './config';

const { accountName, tableName, accountKey, tableEndpoint } = config;
const tableServiceUrl = `${tableEndpoint}/${tableName}`;

const getAuthorizationHeader = (accountName, accountKey, url, method) => {
  const now = new Date().toUTCString();
  const stringToSign = `${method}\n\n\n\n\n\n\n\n\n\n\n\nx-ms-date:${now}\nx-ms-version:2019-02-02\n/${accountName}${url}`;
  const hash = CryptoJS.HmacSHA256(stringToSign, CryptoJS.enc.Base64.parse(accountKey));
  const signature = CryptoJS.enc.Base64.stringify(hash);

  return {
    'x-ms-date': now,
    'x-ms-version': '2019-02-02',
    'Authorization': `SharedKeyLite ${accountName}:${signature}`
  };
};

export const fetchTableData = async () => {
  try {
    const headers = getAuthorizationHeader(accountName, accountKey, `${tableName}`, 'GET');
    const response = await axios.get(tableServiceUrl, { headers });
    return response.data.value;
  } catch (error) {
    console.error('Error fetching data from Azure Table Storage', error);
    throw error;
  }
};

