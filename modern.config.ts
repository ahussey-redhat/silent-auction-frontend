import { appTools, defineConfig } from '@modern-js/app-tools';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig<'rspack'>({
  plugins: [
    appTools({
      bundler: 'experimental-rspack',
    }),
  ],
  runtime: {
    router: true,
    state: true,
  },
  source: {
    globalVars: {
      'process.env.KEYCLOAK_CLIENT_ID': process.env.KEYCLOAK_CLIENT_ID,
      'process.env.KEYCLOAK_REALM': process.env.KEYCLOAK_REALM,
      'process.env.KEYCLOAK_URL': process.env.KEYCLOAK_URL,
      'process.env.BACKEND_URL': process.env.BACKEND_URL,
      'process.env.MIN_TABLE_NUMBER': process.env.MIN_TABLE_NUMBER,
      'process.env.MAX_TABLE_NUMBER': process.env.MAX_TABLE_NUMBER,
    },
  },
  tools: {
    devServer: {
      client: {
        host: process.env.DEVSPACE_URL,
        port: process.env.DEVSPACE_PORT,
        protocol: process.env.DEVSPACE_PROTO as 'ws' | 'wss',
      },
    },
    swc: {
      jsc: {
        experimental: {
          plugins: [['@lingui/swc-plugin', {}]],
        },
      },
    },
  },
});
