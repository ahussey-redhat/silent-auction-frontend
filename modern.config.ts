import { appTools, defineConfig } from '@modern-js/app-tools';
import { ssgPlugin } from '@modern-js/plugin-ssg';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig<'rspack'>({
  plugins: [
    appTools({
      bundler: 'experimental-rspack',
    }),
    ssgPlugin(),
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
    },
  },
  tools: {
    devServer: {
      client: {
        host: process.env.DEVSPACE_URL || 'localhost',
        port: process.env.DEVSPACE_PORT || '80',
        protocol: (process.env.DEVSPACE_PROTO as 'ws' | 'wss') || 'ws',
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
