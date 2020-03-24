// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'jpgzgjimj4'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-yrfrqow9.auth0.com', // Auth0 domain
  clientId: 'ZFVSgl4N0ywwFlXtVLudBJiPSZdENnTG', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
