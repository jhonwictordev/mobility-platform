// Trip Store — State management for trip lifecycle
import { create } from 'zustand';
import { TripStatus, VehicleCategory, PriceEstimate, Trip, WsEvent } from '@mobility/shared';

interface TripState {
  // Current trip
  currentTrip: Trip | null;
  
  // Route planning
  origin: { lat: number; lng: number; address: string } | null;
  destination: { lat: number; lng: number; address: string } | null;
  selectedCategory: VehicleCategory;
  priceEstimates: PriceEstimate[];
  
  // Driver tracking
  driverLocation: { lat: number; lng: number; heading?: number } | null;
  
  // UI state
  isRequesting: boolean;
  isSearching: boolean;
  error: string | null;

  // Actions
  setOrigin: (origin: TripState['origin']) => void;
  setDestination: (destination: TripState['destination']) => void;
  setCategory: (category: VehicleCategory) => void;
  setPriceEstimates: (estimates: PriceEstimate[]) => void;
  setCurrentTrip: (trip: Trip | null) => void;
  setDriverLocation: (location: TripState['driverLocation']) => void;
  requestTrip: (token: string) => Promise<void>;
  cancelTrip: (token: string) => Promise<void>;
  rateTrip: (tripId: string, rating: number, review: string, token: string) => Promise<void>;
  reset: () => void;
}

const API_URL = 'http://localhost:3001';

export const useTripStore = create<TripState>((set, get) => ({
  currentTrip: null,
  origin: null,
  destination: null,
  selectedCategory: VehicleCategory.ECONOMY,
  priceEstimates: [],
  driverLocation: null,
  isRequesting: false,
  isSearching: false,
  error: null,

  setOrigin: (origin) => set({ origin }),
  setDestination: (destination) => set({ destination }),
  setCategory: (category) => set({ selectedCategory: category }),
  setPriceEstimates: (estimates) => set({ priceEstimates: estimates }),
  setCurrentTrip: (trip) => set({ currentTrip: trip }),
  setDriverLocation: (location) => set({ driverLocation: location }),

  requestTrip: async (token: string) => {
    const { origin, destination, selectedCategory } = get();
    if (!origin || !destination) {
      set({ error: 'Selecione origem e destino' });
      return;
    }

    set({ isRequesting: true, error: null });
    try {
      const response = await fetch(`${API_URL}/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          originLat: origin.lat,
          originLng: origin.lng,
          originAddress: origin.address,
          destLat: destination.lat,
          destLng: destination.lng,
          destAddress: destination.address,
          category: selectedCategory,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao solicitar corrida');
      set({
        currentTrip: data.data,
        isRequesting: false,
        isSearching: true,
      });
    } catch (error: any) {
      set({ error: error.message, isRequesting: false });
    }
  },

  cancelTrip: async (token: string) => {
    const { currentTrip } = get();
    if (!currentTrip) return;

    try {
      const response = await fetch(`${API_URL}/trips/${currentTrip.id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: 'Cancelado pelo passageiro' }),
      });
      if (!response.ok) throw new Error('Erro ao cancelar');
      set({ currentTrip: null, isSearching: false, driverLocation: null });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  rateTrip: async (tripId: string, rating: number, review: string, token: string) => {
    try {
      const response = await fetch(`${API_URL}/trips/${tripId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, review }),
      });
      if (!response.ok) throw new Error('Erro ao avaliar');
      set({ currentTrip: null, driverLocation: null });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  reset: () =>
    set({
      currentTrip: null,
      origin: null,
      destination: null,
      selectedCategory: VehicleCategory.ECONOMY,
      priceEstimates: [],
      driverLocation: null,
      isRequesting: false,
      isSearching: false,
      error: null,
    }),
}));
