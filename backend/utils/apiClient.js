const axios = require('axios');

// Base URL for internal API calls (your own backend services)
const INTERNAL_API_BASE = process.env.INTERNAL_API_URL || 'http://localhost:5000/api';

// Create axios instance for internal API calls
const internalApi = axios.create({
  baseURL: INTERNAL_API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for external API calls
const externalApi = axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for internal API (add auth token if needed)
internalApi.interceptors.request.use(
  (config) => {
    // Add internal service token if configured
    const serviceToken = process.env.INTERNAL_SERVICE_TOKEN;
    if (serviceToken) {
      config.headers['X-Service-Token'] = serviceToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
const handleResponseError = (error) => {
  const errorResponse = {
    message: error.message || 'Request failed',
    status: error.response?.status || 500,
    data: error.response?.data || null,
  };
  
  console.error('API Error:', {
    url: error.config?.url,
    method: error.config?.method,
    status: errorResponse.status,
    message: errorResponse.message,
  });
  
  return Promise.reject(errorResponse);
};

internalApi.interceptors.response.use((res) => res, handleResponseError);
externalApi.interceptors.response.use((res) => res, handleResponseError);

// Helper functions for common external API patterns
const fetchExternal = async (url, options = {}) => {
  const { method = 'GET', data = null, headers = {}, params = {} } = options;
  
  const response = await externalApi({
    url,
    method,
    data,
    params,
    headers,
  });
  
  return response.data;
};

// Helper for internal service calls
const fetchInternal = async (endpoint, options = {}) => {
  const { method = 'GET', data = null, params = {} } = options;
  
  const response = await internalApi({
    url: endpoint,
    method,
    data,
    params,
  });
  
  return response.data;
};

module.exports = {
  internalApi,
  externalApi,
  fetchExternal,
  fetchInternal,
};
