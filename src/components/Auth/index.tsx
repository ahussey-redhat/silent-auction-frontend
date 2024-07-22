import { GetModelActions, useModel } from '@modern-js/runtime/model';
import { Navigate, useLocation } from '@modern-js/runtime/router';
import Keycloak, { KeycloakProfile } from 'keycloak-js';
import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import { useAsync } from 'react-use';
import authModel from '@/models/auth';
import { usePathWithParams } from '@/hooks';

type AuthContextType = {
  profile?: KeycloakProfile;
  token?: string;
  hasRole: Keycloak['hasRealmRole'];
  login: GetModelActions<typeof authModel>['login'];
  logout: GetModelActions<typeof authModel>['logout'];
};

const AuthContext = createContext<AuthContextType>(null!);

export type AuthProviderProps = PropsWithChildren;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [{ keycloak, profile, token }, { login, logout }] = useModel(authModel);

  return (
    <AuthContext.Provider
      value={{
        profile,
        token,
        hasRole: keycloak.hasRealmRole.bind(keycloak),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export type RequireAuthProps = { children: JSX.Element };

export const RequireAuth: FunctionComponent<RequireAuthProps> = ({
  children,
}) => {
  const [{ authenticated, profile }, { loadUserProfile, login }] =
    useModel(authModel);

  useAsync(async () => {
    if (!authenticated) {
      await login();
    } else if (profile === undefined) {
      await loadUserProfile();
    }
  }, [authenticated, loadUserProfile, login, profile]);

  return children;
};

export type RequireRoleProps = {
  role: string;
  children: JSX.Element;
};

export const RequireRole: FunctionComponent<RequireRoleProps> = ({
  children,
  role,
}) => {
  const [{ keycloak }] = useModel(authModel);
  const location = useLocation();
  const to = usePathWithParams('/', ['locale']);
  const hasRole = useMemo(() => keycloak.hasRealmRole(role), [keycloak, role]);

  if (!hasRole) {
    return <Navigate to={to} state={{ from: location }} replace />;
  }

  return children ?? null;
};
