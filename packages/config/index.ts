export const CONFIG = {
  BRAND_NAME: 'SIMBORA',
  BRAND_SLOGAN: 'Pediu. Chegou. Simbora!',
  API_URL: process.env.API_URL || 'http://localhost:3001',
  WS_URL: process.env.WS_URL || 'ws://localhost:3001',
  MAPTILER: {
    DEFAULT_KEY: '7bwWEW7XuNoRCA0JLIOJ',
    API_KEY:
      process.env.VITE_MAPTILER_KEY ||
      process.env.NEXT_PUBLIC_MAPTILER_KEY ||
      process.env.EXPO_PUBLIC_MAPTILER_KEY ||
      process.env.MAPTILER_API_KEY ||
      '7bwWEW7XuNoRCA0JLIOJ',
    STYLE_URL: (key?: string) =>
      `https://api.maptiler.com/maps/streets-v2/style.json?key=${key || '7bwWEW7XuNoRCA0JLIOJ'}`,
    TILE_URL: (key?: string) =>
      `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${key || '7bwWEW7XuNoRCA0JLIOJ'}`,
  },
  DEFAULT_MAP_CENTER: {
    lat: -10.2917,
    lng: -36.5819,
    city: 'Penedo - AL',
    region: 'Baixo São Francisco, Alagoas',
  },
  DEFAULT_ORIGIN: {
    lat: -10.4058,
    lng: -36.4344,
    address: 'Praça São Francisco de Borja, 100 - Centro, Piaçabuçu - AL',
  },
  DEFAULT_DESTINATION: {
    lat: -10.2917,
    lng: -36.5819,
    address: 'Largo de São Gonçalo, s/n - Centro Histórico, Penedo - AL',
  },
  DEFAULT_DISPATCH_TIMEOUT_SECONDS: 25,
  LOCATION_UPDATE_INTERVAL_MS: 3000,
};
