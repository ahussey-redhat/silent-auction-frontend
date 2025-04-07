import React, { useEffect, useState, createContext, useContext, ReactNode } from "react";
// @ts-expect-error Need to define Keycloak Types using the admin client
import Keycloak, { KeycloakConfig } from "keycloak-js";
import { useConfig } from '@app/providers/Config';

import { jwtDecode } from "jwt-decode";

import { useApiClient, configureHeaders } from '@app/components/ApiClient';

// -------- Context Setup -------- //
type AuthContextValue = {
  isAuthenticated: boolean;
  token: string | null;
  user: KeycloakTokenPayload | null;
  backendUserProfile: BackendUserProfile | null;
  keycloak: Keycloak;
  login: () => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// -------- AuthProvider Component -------- //
interface AuthProviderProps {
  children: ReactNode;
}

type KeycloakTokenPayload = {
  sub: string;
  given_name?: string;
  family_name?: string;
  groups?: string[];
  email?: string;
  preferred_username?: string;
};

type BackendUserProfile = {
  keycloak_user_id: string;
  keycloak_org_id: string;
  created: Date;
  table_number: number;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const config = useConfig();
  const { apiClient, isConfigured } = useApiClient();
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [isConfigValid, setIsConfigValid] = useState(false);
  const [isConfigChecked, setIsConfigChecked] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<KeycloakTokenPayload | null>(null);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [backendUserProfile, setBackendUserProfile] = useState<BackendUserProfile | null>(null);

  useEffect(() => {
    const valid = !!(
      config.KEYCLOAK_URL &&
      config.KEYCLOAK_REALM &&
      config.KEYCLOAK_CLIENT_ID
    );

    setIsConfigValid(valid);
    setIsConfigChecked(true);

    if (valid) {
      const keycloakConfig: KeycloakConfig = {
        url: config.KEYCLOAK_URL,
        realm: config.KEYCLOAK_REALM,
        clientId: config.KEYCLOAK_CLIENT_ID,
      };

      const keycloakInstance = new Keycloak(keycloakConfig);
      setKeycloak(keycloakInstance);
    }
  }, [config.KEYCLOAK_URL, config.KEYCLOAK_REALM, config.KEYCLOAK_CLIENT_ID]);


  const decodeToken = (token: string) => {
    try {
      const decoded: KeycloakTokenPayload = jwtDecode(token);
      setUser(decoded);
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  };

  const fetchBackendUserProfile = async (token: string) => {
    try {
      configureHeaders(apiClient, token);
      if (!isConfigured) throw new Error('API client not configured yet');

      const response = await apiClient.get(`/api/v1/me`);
      if (response.status === 200) {
        setBackendUserProfile(response.data);
      } else {
        console.warn(response.data);
      }
    } catch (error) {
      console.error("Error fetching the user profile:", error);
    }
  };


  const initKeycloak = async () => {
    try {
      if (!keycloak) {
        console.error("Keycloak is not initialized");
        return;
      }

      const authenticated = await keycloak.init({
        flow: "standard",
        onLoad: "login-required",
        pkceMethod: "S256",
        checkLoginIframe: false,
      });

      if (authenticated) {
        setIsAuthenticated(true);
        setToken(keycloak.token);
        decodeToken(keycloak.token);
      } else {
        console.info("User is not logged in");
      }
      setIsAuthInitialized(true);
    } catch (error) {
      console.error("Keycloak initialization error:", error);
      setIsAuthInitialized(true); // Prevent blocking UI indefinitely
    }
  };

  const login = async () => {
    try {
      if (!keycloak) {
        console.error("Keycloak is not initialized");
        return;
      }
      await keycloak.login({
        prompt: "login",
      }); // Triggers the Keycloak login flow
      setIsAuthenticated(true);
      setToken(keycloak.token);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    try {
      if (!keycloak) {
        console.error("Keycloak is not initialized");
        return;
      }
      await keycloak.logout({
        redirectUri: window.location.origin, // Redirect to home after logout
      });
      setIsAuthenticated(false);
      setToken(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchBackendUserProfile(token);
    }
  }, [user, token]);


  useEffect(() => {
    if (keycloak) {
      initKeycloak();
    }
  }, [keycloak]);

  const refreshToken = async () => {
    try {
      if (!keycloak || !keycloak.refreshToken) {
        logout();
        return;
      }

      const refreshed: boolean = await keycloak.updateToken(90);
      if (refreshed) {
        setToken(keycloak.token);
        decodeToken(keycloak.token);
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      const interval = setInterval(() => {
        refreshToken();
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, token]);

  if (!isConfigChecked) {
    return <div>Checking authentication configuration...</div>;
  }

  if (!isConfigValid) {
    return (
      <div>
        <h2>Authentication Configuration Error</h2>
        <p>Missing required Keycloak configuration. Please check your environment variables:</p>
        <ul>
          <li>KEYCLOAK_URL: {config.KEYCLOAK_URL ? '✓' : '✗'}</li>
          <li>KEYCLOAK_REALM: {config.KEYCLOAK_REALM ? '✓' : '✗'}</li>
          <li>KEYCLOAK_CLIENT_ID: {config.KEYCLOAK_CLIENT_ID ? '✓' : '✗'}</li>
        </ul>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      token,
      user,
      backendUserProfile,
      keycloak: keycloak as Keycloak,
      login,
      logout,
      refreshToken
    }}>
      {isAuthInitialized ? children : <div>Initializing authentication...</div>}
    </AuthContext.Provider>
  );
};

// -------- useAuth Hook -------- //
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;