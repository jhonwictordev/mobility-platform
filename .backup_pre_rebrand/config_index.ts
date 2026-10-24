export const CONFIG = {
  API_URL: process.env.API_URL || 'http://localhost:3001',
  WS_URL: process.env.WS_URL || 'ws://localhost:3001',
  DEFAULT_MAP_CENTER: {
    lat: -23.5615,
    lng: -46.6559,
    city: 'São Paulo - SP',
  },
  DEFAULT_DISPATCH_TIMEOUT_SECONDS: 25,
  LOCATION_UPDATE_INTERVAL_MS: 3000,
};
