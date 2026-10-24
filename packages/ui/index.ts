// SIMBORA Design Tokens and Visual UI System
// Alagoas Regional Mobility Platform (Penedo ⇄ Piaçabuçu)

export const BRAND = {
  name: 'SIMBORA',
  driverName: 'SIMBORA Motorista',
  studioName: 'SIMBORA Studio',
  adminName: 'SIMBORA Admin',
  slogan: 'Pediu. Chegou. Simbora!',
  tagline: 'Mobilidade urbana e intermunicipal com o calor da nossa terra.',
  region: 'Alagoas • Brasil',
  corridor: 'Penedo ⇄ Piaçabuçu',
  alternatives: [
    'Seu caminho sem complicação.',
    'Mobilidade com o calor da nossa terra.',
    'De ponta a ponta, vai de Simbora.',
    'A rota certa pro seu dia render.',
    'Conectando cidades, aproximando pessoas.',
  ],
};

export const COLORS = {
  // Brand Core Colors (WCAG AA / AAA Compliant)
  brandDeep: '#123D32',      // Verde Profundo Floresta/Rio São Francisco
  brandVibrant: '#16A572',   // Verde Vibrante Ação/Dinamismo
  brandEnergy: '#FFCC45',    // Amarelo Energia Sol do Nordeste
  surfaceClean: '#F8F9F6',   // Branco Suave Canvas
  surfaceDark: '#17211D',    // Grafite Mineral Cockpit

  // Compatibility Aliases for existing apps
  primary: '#16A572',        // Now maps to SIMBORA Verde Vibrante
  primaryDark: '#123D32',    // Maps to SIMBORA Verde Profundo
  accent: '#FFCC45',         // Maps to SIMBORA Amarelo Energia
  success: '#16A572',        // Success Emerald
  warning: '#FFCC45',        // Warning Amber
  danger: '#EF4444',         // Red Alert
  background: '#F8F9F6',     // Clean background
  surface: '#FFFFFF',
  textPrimary: '#17211D',    // Mineral Dark text
  textSecondary: '#4B5563',  // Slate 600
  border: '#E2E8F0',         // Subtle border

  // Cockpit / Dark Mode Tokens
  cockpitBg: '#17211D',
  cockpitCard: '#1E2E28',
  cockpitBorder: '#284238',
  cockpitText: '#F8F9F6',
  cockpitAccent: '#FFCC45',
};

export const VEHICLE_ICONS: Record<string, string> = {
  economy: '🚗',
  comfort: '🚙',
  premium: '✨',
  intermunicipal: '🚐',
};

export const CATEGORY_DETAILS: Record<string, { label: string; desc: string; icon: string; multiplier: number }> = {
  economy: {
    label: 'Simbora Econômico',
    desc: 'Corridas urbanas rápidas e econômicas',
    icon: '🚗',
    multiplier: 1.0,
  },
  comfort: {
    label: 'Simbora Conforto',
    desc: 'Carros modernos, ar condicionado e mais espaço',
    icon: '🚙',
    multiplier: 1.4,
  },
  premium: {
    label: 'Simbora Intermunicipal',
    desc: 'Viagens entre Penedo e Piaçabuçu com conforto total',
    icon: '✨',
    multiplier: 2.1,
  },
};

export const STATUS_BADGES: Record<string, { label: string; bg: string; text: string; border?: string }> = {
  REQUESTED: { label: 'Solicitada', bg: '#ECFDF5', text: '#123D32', border: '#16A572' },
  SEARCHING: { label: '🔍 Buscando Motorista...', bg: '#FEF3C7', text: '#92400E', border: '#FFCC45' },
  ACCEPTED: { label: '✅ Corrida Aceita', bg: '#DCFCE7', text: '#166534', border: '#16A572' },
  DRIVER_ARRIVING: { label: '🚗 Motorista a Caminho', bg: '#E0F2FE', text: '#0369A1', border: '#38BDF8' },
  DRIVER_ARRIVED: { label: '📍 Motorista no Embarque', bg: '#FEF9C3', text: '#854D0E', border: '#FACC15' },
  IN_PROGRESS: { label: '🛣️ Em Viagem', bg: '#E0E7FF', text: '#3730A3', border: '#818CF8' },
  COMPLETED: { label: '🎉 Viagem Concluída', bg: '#DCFCE7', text: '#166534', border: '#16A572' },
  CANCELLED_BY_PASSENGER: { label: 'Cancelada pelo Passageiro', bg: '#FEE2E2', text: '#991B1B', border: '#F87171' },
  CANCELLED_BY_DRIVER: { label: 'Cancelada pelo Motorista', bg: '#FEE2E2', text: '#991B1B', border: '#F87171' },
};

export const ALAGOAS_LANDMARKS = {
  piacabucu: {
    name: 'Piaçabuçu — Centro (Foz do São Francisco)',
    address: 'Praça São Francisco de Borja, Piaçabuçu - AL',
    lat: -10.4058,
    lng: -36.4344,
  },
  penedo: {
    name: 'Penedo — Centro Histórico',
    address: 'Largo de São Gonçalo, Penedo - AL',
    lat: -10.2917,
    lng: -36.5819,
  },
  pontalDoPeba: {
    name: 'Pontal do Peba — Praia & Dunas',
    address: 'Av. Beira Mar, Pontal do Peba, Piaçabuçu - AL',
    lat: -10.4682,
    lng: -36.3812,
  },
  orlaPenedo: {
    name: 'Orla do Rio São Francisco',
    address: 'Av. Beira Rio, Penedo - AL',
    lat: -10.2934,
    lng: -36.5802,
  },
};
