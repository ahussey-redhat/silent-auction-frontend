import { model, useModel } from '@modern-js/runtime/model';
import Keycloak from 'keycloak-js';

type State = {
  keycloak: Keycloak;
};

const keycloak = new Keycloak({
  clientId: process.env.KEYCLOAK_CLIENT_ID!,
  realm: process.env.KEYCLOAK_REALM!,
  url: process.env.KEYCLOAK_URL!,
});

await keycloak.init({ checkLoginIframe: false });

const keycloakEffect =
  <T>(use: typeof useModel, callback: (keycloak: Keycloak) => Promise<T>) =>
  async () => {
    const [{ keycloak }, { setKeycloak }] = use(authModel);

    const result = await callback(keycloak);

    setKeycloak(keycloak);

    return result;
  };

const authModel = model<State>('auth').define((_, { use }) => ({
  state: {
    keycloak,
  },
  computed: {
    authenticated: ({ keycloak }) => keycloak.authenticated ?? false,
    profile: ({ keycloak }) => keycloak.profile,
    token: ({ keycloak }) => keycloak.token,
  },
  effects: {
    loadUserProfile: keycloakEffect(use, keycloak =>
      keycloak.loadUserProfile(),
    ),
    login: keycloakEffect(use, keycloak => keycloak.login()),
    logout: keycloakEffect(use, keycloak => keycloak.logout()),
    clearToken: keycloakEffect(use, keycloak =>
      Promise.resolve(keycloak.clearToken()),
    ),
    updateToken: keycloakEffect(use, keycloak => keycloak.updateToken()),
  },
}));

export default authModel;
