'use client';
import getConfig from 'next/config';
import React, {  createContext, useContext, useEffect, useState } from 'react';

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

  useEffect(() => {
    // Try to get config from Next.js runtime config
    const nextConfig = getConfig();
    const publicRuntimeConfig = nextConfig?.publicRuntimeConfig;

    // Check if we're in development and have dev config
    const devConfig = (window as Window & { __NEXT_RUNTIME_CONFIG?: RuntimeConfig }).__NEXT_RUNTIME_CONFIG;

    // Determine which config to use
    let finalConfig: RuntimeConfig;

    if (publicRuntimeConfig && Object.keys(publicRuntimeConfig).length > 0) {
      // Production mode - use publicRuntimeConfig from container env vars
      console.debug("Using production runtime config");
      finalConfig = publicRuntimeConfig;
    } else if (devConfig) {
      // Development mode - use dev-runtime-config.js values
      console.debug("Using development runtime config");
      finalConfig = devConfig;
    } else {
      // Fallback with empty values
      console.warn("No runtime config found!");
      finalConfig = {};
    }

    console.debug("Runtime config values:", finalConfig);
    setConfig(finalConfig);
  }, []);


  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}