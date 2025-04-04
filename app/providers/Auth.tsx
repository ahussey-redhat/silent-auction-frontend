import React, { useEffect, useState, createContext, useContext, ReactNode } from "react";
// @ts-expect-error Need to define Keycloak Types using the admin client
import Keycloak, { KeycloakConfig, KeycloakInstance } from "keycloak-js";

import { jwtDecode } from "jwt-decode";

import apiClient, { configureHeaders } from "../components/ApiClient";

// -------- Keycloak Configuration -------- //
const keycloakConfig: KeycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
};

type BackendUserProfile = {
  keycloak_user_id: string;
  keycloak_org_id: string;
  created: Date;
  table_number: number;
}

const keycloak = new Keycloak(keycloakConfig);

// -------- Context Setup -------- //
type AuthContextValue = {
  isAuthenticated: boolean;
  token: string | null;
  user: KeycloakTokenPayload | null;
  backendUserProfile: BackendUserProfile | null;
  keycloak: KeycloakInstance;
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

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<KeycloakTokenPayload | null>(null);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [backendUserProfile, setBackendUserProfile] = useState<BackendUserProfile | null>(null);

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
      configureHeaders(token);
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

  // Periodically refresh the token
  const refreshToken = async () => {
    try {
      if (!keycloak.refreshToken) {
        logout()
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

  const login = async () => {
    try {
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


  // Initialize Keycloak on component mount
  useEffect(() => {
    initKeycloak();

    // Set up periodic token refresh (every 30 seconds)
    const refreshInterval = setInterval(() => {
      if (keycloak.authenticated) {
        refreshToken();
      }
    }, 30000);

    return () => clearInterval(refreshInterval);
    // Requires empty dependency array, to avoid trying to init continously
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  if (!isAuthInitialized) {
    return <div>Securing application...</div>; // Show a loading state while initializing
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      token,
      user,
      backendUserProfile,
      keycloak,
      login,
      logout,
      refreshToken
    }}>
      {children}
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