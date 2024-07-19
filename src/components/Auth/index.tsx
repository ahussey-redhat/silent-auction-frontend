import { GetModelActions, useModel } from '@modern-js/runtime/model';
import type { KeycloakProfile } from 'keycloak-js';
import { createContext, PropsWithChildren, useContext } from 'react';
import { useAsync } from 'react-use';
import authModel from '@/models/auth';

type AuthContextType = {
  profile?: KeycloakProfile;
  token?: string;
  login: GetModelActions<typeof authModel>['login'];
  logout: GetModelActions<typeof authModel>['logout'];
};

const AuthContext = createContext<AuthContextType>(null!);

export type AuthProviderProps = PropsWithChildren;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [{ profile, token }, { login, logout }] = useModel(authModel);

  return (
    <AuthContext.Provider
      value={{
        profile,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const [
    { authenticated, initialised, profile },
    { initialise, loadUserProfile, login },
  ] = useModel(authModel);

  useAsync(async () => {
    if (!initialised) {
      await initialise();
    }
  }, [initialise, initialised]);

  useAsync(async () => {
    if (!initialised) {
      return;
    }

    if (!authenticated) {
      await login();
    } else if (profile === undefined) {
      await loadUserProfile();
    }
  }, [authenticated, initialised, loadUserProfile, login, profile]);

  return children;
};
