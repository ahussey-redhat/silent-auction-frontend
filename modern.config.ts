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
  tools: {
    swc: {
      jsc: {
        experimental: {
          plugins: [['@lingui/swc-plugin', {}]],
        },
      },
    },
  },
});
