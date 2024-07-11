import { GetModelState, useModel } from '@modern-js/runtime/model';
import { Navigate, useLocation } from '@modern-js/runtime/router';
import { createContext, PropsWithChildren, useContext, useEffect } from 'react';
import { usePathWithParams } from '@/hooks';
import authModel from '@/models/auth';

type AuthContextType = {
  user: NonNullable<GetModelState<typeof authModel>['user']>;
};

const AuthContext = createContext<AuthContextType>(null!);

export type AuthProviderProps = PropsWithChildren;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [{ user }, { loadFromLocalStorage }] = useModel(authModel);

  useEffect(() => loadFromLocalStorage(), []);

  return (
    <AuthContext.Provider value={{ user: user! }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  const location = useLocation();
  const to = usePathWithParams('/login', ['locale']);

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to={to} state={{ from: location }} replace />;
  }

  return children;
};
