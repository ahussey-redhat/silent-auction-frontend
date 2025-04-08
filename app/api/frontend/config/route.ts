import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    KEYCLOAK_URL: process.env.KEYCLOAK_URL || '',
    KEYCLOAK_REALM: process.env.KEYCLOAK_REALM || '',
    KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID || '',
    BACKEND_URL: process.env.BACKEND_URL || '',
    BID_INCREMENT: process.env.BID_INCREMENT || '',
    ADMIN_GROUP_NAME: process.env.ADMIN_GROUP_NAME || '',
  };
  return NextResponse.json(config);
}