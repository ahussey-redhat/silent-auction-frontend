import { model, useModel } from '@modern-js/runtime/model';
import Keycloak from 'keycloak-js';

type State = {
  keycloak: Keycloak;
  initialised: boolean;
};

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
    keycloak: new Keycloak({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      realm: process.env.KEYCLOAK_REALM!,
      url: process.env.KEYCLOAK_URL!,
    }),
    initialised: false,
  },
  computed: {
    authenticated: ({ keycloak }) => keycloak.authenticated ?? false,
    profile: ({ keycloak }) => keycloak.profile,
    token: ({ keycloak }) => keycloak.token,
  },
  effects: {
    initialise: keycloakEffect(use, async keycloak => {
      const [, { setInitialised }] = use(authModel);

      await keycloak.init({ checkLoginIframe: false });

      setInitialised(true);
    }),
    login: keycloakEffect(use, keycloak => keycloak.login()),
    logout: keycloakEffect(use, keycloak => keycloak.logout()),
  },
}));

export default authModel;
