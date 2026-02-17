const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const BASE_API_URL = envApiBaseUrl || 'http://localhost:8081/api/v1';
