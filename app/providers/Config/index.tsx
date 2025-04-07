'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

type RuntimeConfig = {
  BACKEND_URL?: string;
  KEYCLOAK_URL?: string;
  KEYCLOAK_REALM?: string;
  KEYCLOAK_CLIENT_ID?: string;
  BID_INCREMENT?: string;
};

const ConfigContext = createContext<RuntimeConfig>({});

export default function ConfigProvider({
                                 children
                               }: {
  children: React.ReactNode
}) {
  const [config, setConfig] = useState<RuntimeConfig>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const devConfig = (window as Window & { __NEXT_RUNTIME_CONFIG?: RuntimeConfig }).__NEXT_RUNTIME_CONFIG;

    if (devConfig) {
      // Development mode - use dev-runtime-config.js values
      console.debug("Using development runtime config");
      setConfig(devConfig);
      setLoading(false);
      return;
    }

    // Production mode - fetch config from server API
    const fetchConfig = async () => {
      try {
        const response = await axios.get('/api/config');
        console.debug("Runtime config received:", response.data);
        setConfig(response.data);
      } catch (error) {
        console.error("Failed to fetch runtime config:", error);
        setConfig({}); // Empty config will trigger validation errors
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  if (loading) {
    // You could return a loading indicator here if needed
    return null;
  }

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}