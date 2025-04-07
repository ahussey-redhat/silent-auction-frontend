'use client'
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useEffect, useState, useMemo } from "react";
import { useConfig } from '@app/providers/Config';

// Create a base instance without baseURL for initialization purposes
const createApiInstance = (baseURL = '') => {
  return axios.create({ baseURL });
};

// Default instance with empty baseURL
const defaultApiClient = createApiInstance();

export function useApiClient() {
  const config = useConfig();
  const [isConfigured, setIsConfigured] = useState(false);

  // Create a new instance when the baseURL changes
  const apiClient = useMemo(() => {
    if (!config.BACKEND_URL) {
      console.debug('No BACKEND_URL available yet');
      return defaultApiClient;
    }
    return createApiInstance(config.BACKEND_URL);
  }, [config.BACKEND_URL]);

  // Track configuration status
  useEffect(() => {
    if (config.BACKEND_URL) {
      setIsConfigured(true);
    } else {
      setIsConfigured(false);
    }
  }, [config.BACKEND_URL]);

  return { apiClient, isConfigured };
}

export const configureHeaders = (apiClient: AxiosInstance, token: string | null) => {
  if (!apiClient || !token) return;

  const interceptorId = apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      config.headers = config.headers || {};
      config.headers.Authorization = config.headers.Authorization || `Bearer ${token}`;
      return config;
    },
    (error) => {
      console.error("Request interceptor error:", error);
      return Promise.reject(error);
    }
  );

  // Return a function to eject the interceptor if needed
  return () => {
    apiClient.interceptors.request.eject(interceptorId);
  };
};

// Export the default client for compatibility, but recommend using the hook
export default defaultApiClient;