import PKCE from "js-pkce";

const pkce = new PKCE({
    client_id: 'necyoTSYxRMyy4Eb',
    redirect_uri: "http://localhost:8087/callback",
    authorization_endpoint: 'https://lichess.org/oauth',
    token_endpoint: 'https://lichess.org/api/token',
    requested_scopes: ['preference:read board:play email:read'],
  });
  
export default {
    pkce    
};