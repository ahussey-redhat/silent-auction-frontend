/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['en', 'en-PL'],
  sourceLocale: 'en',
  pseudoLocale: 'en-PL',
  fallbackLocales: {
    'en-PL': 'en',
  },
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}/messages',
      include: ['src'],
    },
  ],
  format: 'po',
};
