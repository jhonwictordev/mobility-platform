// Shared Design Tokens and Visual UI Helpers
export const COLORS = {
  primary: '#4F46E5', // Indigo-600
  primaryDark: '#3730A3',
  success: '#10B981', // Emerald-500
  warning: '#F59E0B', // Amber-500
  danger: '#EF4444', // Red-500
  background: '#F9FAFB',
  surface: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
};

export const VEHICLE_ICONS: Record<string, string> = {
  economy: '🚗',
  comfort: '🚙',
  premium: '✨',
};

export const STATUS_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  REQUESTED: { label: 'Solicitada', bg: '#EEF2FF', text: '#4F46E5' },
  SEARCHING: { label: 'Buscando Motorista', bg: '#FEF3C7', text: '#B45309' },
  ACCEPTED: { label: 'Aceita', bg: '#D1FAE5', text: '#065F46' },
  DRIVER_ARRIVING: { label: 'Motorista a Caminho', bg: '#E0E7FF', text: '#3730A3' },
  DRIVER_ARRIVED: { label: 'Motorista no Local', bg: '#ECFDF5', text: '#059669' },
  IN_PROGRESS: { label: 'Em Viagem', bg: '#DBEAFE', text: '#1E40AF' },
  COMPLETED: { label: 'Concluída', bg: '#D1FAE5', text: '#047857' },
  CANCELLED_BY_PASSENGER: { label: 'Cancelada pelo Passageiro', bg: '#FEE2E2', text: '#B91C1C' },
  CANCELLED_BY_DRIVER: { label: 'Cancelada pelo Motorista', bg: '#FEE2E2', text: '#B91C1C' },
};
