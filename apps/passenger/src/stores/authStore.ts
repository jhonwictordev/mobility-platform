// Auth Store — Zustand state management for authentication and passenger profile
import { create } from 'zustand';

export interface SavedPlace {
  id: string;
  label: string;
  address: string;
  lat: number;
  lng: number;
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role?: string;
  phoneVerified?: boolean;
  preferences?: string | any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  savedPlaces: SavedPlace[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (identifier: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;

  // Profile Management
  fetchProfile: () => Promise<void>;
  updateProfile: (data: { name?: string; phone?: string; avatar?: string; preferences?: any }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;

  // OTP Verification
  sendOtp: (identifier: string) => Promise<{ success: boolean; code?: string; message: string }>;
  verifyOtp: (identifier: string, code: string) => Promise<boolean>;

  // Password Recovery
  forgotPassword: (email: string) => Promise<{ success: boolean; resetToken?: string; message: string }>;
  resetPassword: (token: string, newPass: string) => Promise<void>;

  // Saved Places
  loadSavedPlaces: () => Promise<void>;
  addSavedPlace: (place: { label: string; address: string; lat: number; lng: number }) => Promise<void>;
  deleteSavedPlace: (id: string) => Promise<void>;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  savedPlaces: [],
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (identifier: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao fazer login');
      set({
        user: data.user,
        token: data.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
      get().loadSavedPlaces();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string, phone: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, role: 'passenger' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao registrar');
      set({
        user: data.user,
        token: data.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
      get().loadSavedPlaces();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    set({ user: null, token: null, savedPlaces: [], isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null }),

  fetchProfile: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const user = await res.json();
        set({ user });
      }
    } catch (e) {
      console.log('Error fetching profile', e);
    }
  },

  updateProfile: async (data) => {
    const { token } = get();
    if (!token) return;
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.message || 'Erro ao atualizar perfil');
      set({ user: updated, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    const { token } = get();
    if (!token) return;
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/users/me/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao alterar senha');
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteAccount: async () => {
    const { token } = get();
    if (!token) return;
    try {
      await fetch(`${API_URL}/users/me`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      get().logout();
    } catch (e) {
      console.log('Error deleting account', e);
    }
  },

  sendOtp: async (identifier) => {
    const res = await fetch(`${API_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier }),
    });
    return res.json();
  },

  verifyOtp: async (identifier, code) => {
    const res = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, code }),
    });
    const data = await res.json();
    if (res.ok && data.verified) {
      get().fetchProfile();
      return true;
    }
    throw new Error(data.message || 'Código inválido');
  },

  forgotPassword: async (email) => {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  resetPassword: async (token, newPassword) => {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erro ao redefinir senha');
  },

  loadSavedPlaces: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/users/me/places`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const places = await res.json();
        set({ savedPlaces: places });
      }
    } catch (e) {
      console.log('Error loading places', e);
    }
  },

  addSavedPlace: async (place) => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/users/me/places`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(place),
      });
      if (res.ok) {
        await get().loadSavedPlaces();
      }
    } catch (e) {
      console.log('Error adding place', e);
    }
  },

  deleteSavedPlace: async (id) => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/users/me/places/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await get().loadSavedPlaces();
      }
    } catch (e) {
      console.log('Error deleting place', e);
    }
  },
}));
