import { create } from 'zustand';
import { DriverStatus, TripStatus } from '@mobility/shared';

interface DriverStoreState {
  driver: any | null;
  token: string | null;
  status: DriverStatus;
  incomingOffer: any | null;
  activeTrip: any | null;
  currentLat: number;
  currentLng: number;
  todayEarnings: number;
  completedTripsCount: number;

  login: (email: string, pass: string) => Promise<void>;
  toggleOnline: () => Promise<void>;
  acceptIncomingOffer: () => Promise<void>;
  declineIncomingOffer: () => void;
  updateTripStatus: (status: TripStatus) => Promise<void>;
  sendLocationUpdate: (lat: number, lng: number) => Promise<void>;
  setIncomingOffer: (offer: any) => void;
}

const API_URL = 'http://localhost:3001';

export const useDriverStore = create<DriverStoreState>((set, get) => ({
  driver: null,
  token: null,
  status: DriverStatus.OFFLINE,
  incomingOffer: null,
  activeTrip: null,
  currentLat: -23.562,
  currentLng: -46.654,
  todayEarnings: 142.8,
  completedTripsCount: 6,

  login: async (email: string, pass: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login falhou');

      // Fetch driver profile
      const driverRes = await fetch(`${API_URL}/drivers/me`, {
        headers: { Authorization: `Bearer ${data.accessToken}` },
      });
      const driverData = await driverRes.json();

      set({
        token: data.accessToken,
        driver: driverData || {
          id: 'driver_mock_id',
          name: data.user.name,
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

  toggleOnline: async () => {
    const { status, driver, token } = get();
    const newStatus =
      status === DriverStatus.ONLINE ? DriverStatus.OFFLINE : DriverStatus.ONLINE;

    if (driver && token) {
      try {
        await fetch(`${API_URL}/drivers/${driver.id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });
      } catch (e) {
        console.log('Error updating status', e);
      }
    }

    set({ status: newStatus });
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

  declineIncomingOffer: () => {
    set({ incomingOffer: null });
  },

  updateTripStatus: async (status: TripStatus) => {
    const { activeTrip, token } = get();
    if (!activeTrip || !token) return;

    try {
      const res = await fetch(`${API_URL}/trips/${activeTrip.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();

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
    } catch (e) {
      console.error(e);
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
