module.exports = {
  output: "standalone",
  publicRuntimeConfig: {
    KEYCLOAK_URL: process.env.KEYCLOAK_URL,
    KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
    KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
    BACKEND_URL: process.env.BACKEND_URL,
    BID_INCREMENT: process.env.BID_INCREMENT,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '**',
        search: '',
      },
    ],
  },
}