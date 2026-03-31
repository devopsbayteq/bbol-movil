import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://dev4.bayteq.com:50110/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'X-Platform': 'VALOR_A_DEFINIR',
  },
  timeout: 15000,
});

export default apiClient;
