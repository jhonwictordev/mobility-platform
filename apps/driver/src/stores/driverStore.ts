import { create } from 'zustand';
import { DriverStatus, TripStatus } from '@mobility/shared';

interface DriverStoreState {
  driver: any | null;
  user: any | null;
  token: string | null;
  status: DriverStatus;
  documents: any[];
  vehicles: any[];
  incomingOffer: any | null;
  activeTrip: any | null;
  currentLat: number;
  currentLng: number;
  todayEarnings: number;
  completedTripsCount: number;

  login: (identifier: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, phone: string, licenseNumber: string) => Promise<void>;
  logout: () => void;
  fetchDriverProfile: () => Promise<void>;
  updateDriverDetails: (data: { licenseNumber?: string; cnhCategory?: string; pixKey?: string; pixKeyType?: string }) => Promise<any>;
  fetchDocuments: () => Promise<void>;
  uploadDocument: (type: string, fileUrl: string) => Promise<any>;
  fetchVehicles: () => Promise<void>;
  addVehicle: (vehicleData: any) => Promise<any>;
  toggleOnline: () => Promise<void>;
  acceptIncomingOffer: () => Promise<void>;
  declineIncomingOffer: () => void | Promise<void>;
  updateTripStatus: (status: TripStatus, pinCode?: string) => Promise<void>;
  sendLocationUpdate: (lat: number, lng: number) => Promise<void>;
  setIncomingOffer: (offer: any) => void;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export const useDriverStore = create<DriverStoreState>((set, get) => ({
  driver: null,
  user: null,
  token: null,
  status: DriverStatus.OFFLINE,
  documents: [],
  vehicles: [],
  incomingOffer: null,
  activeTrip: null,
  currentLat: -10.35,
  currentLng: -36.50,
  todayEarnings: 142.8,
  completedTripsCount: 6,

  login: async (identifier: string, pass: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login falhou');

      // Fetch driver profile
      let driverData = data.driver;
      if (!driverData) {
        const driverRes = await fetch(`${API_URL}/drivers/me`, {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        });
        if (driverRes.ok) {
          driverData = await driverRes.json();
        }
      }

      set({
        token: data.accessToken,
        user: data.user,
        driver: driverData || {
          id: 'driver_mock_id',
          licenseNumber: 'AL-9876543210',
          approvalStatus: 'approved',
          rating: 4.9,
          totalTrips: 342,
        },
        status: driverData?.status || DriverStatus.OFFLINE,
      });
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  },

  register: async (name, email, pass, phone, licenseNumber) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password: pass,
          phone,
          role: 'driver',
          licenseNumber,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registro falhou');

      set({
        token: data.accessToken,
        user: data.user,
        driver: data.driver,
        status: DriverStatus.OFFLINE,
      });
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  },

  logout: () => {
    set({
      token: null,
      user: null,
      driver: null,
      activeTrip: null,
      incomingOffer: null,
      status: DriverStatus.OFFLINE,
    });
  },

  fetchDriverProfile: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/drivers/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const driver = await res.json();
        set({ driver, status: driver.status });
      }
    } catch (e) {
      console.log('Error fetching driver profile', e);
    }
  },

  updateDriverDetails: async (data) => {
    const { token } = get();
    if (!token) throw new Error('Não autenticado');
    const res = await fetch(`${API_URL}/drivers/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    if (!res.ok) throw new Error(updated.message || 'Falha ao atualizar dados');
    set({ driver: updated });
    return updated;
  },

  fetchDocuments: async () => {
    const { driver, token } = get();
    if (!driver || !token) return;
    try {
      const res = await fetch(`${API_URL}/documents/driver/${driver.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const docs = await res.json();
        set({ documents: docs });
      }
    } catch (e) {
      console.error('Error fetching documents', e);
    }
  },

  uploadDocument: async (type: string, fileUrl: string) => {
    const { driver, token } = get();
    if (!driver || !token) throw new Error('Driver não autenticado');
    const res = await fetch(`${API_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        driverId: driver.id,
        type,
        fileUrl,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Falha ao enviar documento');
    await get().fetchDocuments();
    return data;
  },

  fetchVehicles: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/vehicles/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const vehicles = await res.json();
        set({ vehicles });
      }
    } catch (e) {
      console.error('Error fetching vehicles', e);
    }
  },

  addVehicle: async (vehicleData: any) => {
    const { token, driver } = get();
    if (!token) throw new Error('Não autenticado');
    const res = await fetch(`${API_URL}/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...vehicleData,
        driverId: driver?.id,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Falha ao cadastrar veículo');
    await get().fetchVehicles();
    await get().fetchDriverProfile();
    return data;
  },

  toggleOnline: async () => {
    const { status, driver, token } = get();
    const newStatus =
      status === DriverStatus.ONLINE ? DriverStatus.OFFLINE : DriverStatus.ONLINE;

    if (driver && token) {
      const res = await fetch(`${API_URL}/drivers/${driver.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Não foi possível alterar status');
      }
      set({ status: newStatus });
    } else {
      set({ status: newStatus });
    }
  },

  setIncomingOffer: (offer) => set({ incomingOffer: offer }),

  acceptIncomingOffer: async () => {
    const { incomingOffer, driver, token } = get();
    if (!incomingOffer || !driver || !token) return;

    try {
      const res = await fetch(
        `${API_URL}/trips/${incomingOffer.tripId}/accept`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ driverId: driver.id }),
        },
      );
      const data = await res.json();
      set({
        activeTrip: data.data || incomingOffer,
        incomingOffer: null,
        status: DriverStatus.BUSY,
      });
    } catch (e) {
      console.error(e);
    }
  },

  declineIncomingOffer: async () => {
    const { incomingOffer, token } = get();
    if (incomingOffer && token) {
      try {
        await fetch(`${API_URL}/trips/${incomingOffer.tripId}/decline`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (e) {
        // ignore
      }
    }
    set({ incomingOffer: null });
  },

  updateTripStatus: async (status: TripStatus, pinCode?: string) => {
    const { activeTrip, token } = get();
    if (!activeTrip || !token) return;

    try {
      const res = await fetch(`${API_URL}/trips/${activeTrip.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, pinCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Falha ao atualizar status da corrida');

      if (status === TripStatus.COMPLETED) {
        set((state) => ({
          activeTrip: null,
          status: DriverStatus.ONLINE,
          todayEarnings: state.todayEarnings + Number(activeTrip.fare || 18.5),
          completedTripsCount: state.completedTripsCount + 1,
        }));
      } else {
        set({ activeTrip: data.data });
      }
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  },

  sendLocationUpdate: async (lat: number, lng: number) => {
    const { driver, token, activeTrip } = get();
    set({ currentLat: lat, currentLng: lng });

    if (driver && token) {
      try {
        await fetch(`${API_URL}/location/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            driverId: driver.id,
            lat,
            lng,
            tripId: activeTrip?.id,
          }),
        });
      } catch (e) {
        // quiet catch
      }
    }
  },
}));
