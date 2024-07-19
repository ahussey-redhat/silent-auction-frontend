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
  const [{ authenticated, initialised }, { initialise, login }] =
    useModel(authModel);

  useAsync(async () => {
    if (!initialised) {
      await initialise();
    }
  }, [initialise, initialised]);

  useAsync(async () => {
    if (initialised && !authenticated) {
      await login();
    }
  }, [authenticated, initialised, login]);

  return children;
};
