const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    return headers;
  }

  private buildUrl(path: string, params?: Record<string, string>): string {
    const url = new URL(path, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    return url.toString();
  }

  async request<T>(path: string, options: FetchOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;
    const url = this.buildUrl(path, params);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          ...this.getHeaders(),
          ...fetchOptions.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new ApiError(
          error.message || `HTTP ${response.status}`,
          response.status,
          error
        );
      }

      if (response.status === 204) {
        return undefined as T;
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("Network error. Please check your connection.", 0);
    }
  }

  get<T>(path: string, params?: Record<string, string>) {
    return this.request<T>(path, { method: "GET", params });
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: "DELETE" });
  }
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const api = new ApiClient(API_BASE_URL);

// API endpoints
export const endpoints = {
  // Dashboard
  dashboard: {
    stats: () => api.get<DashboardStats>("/api/admin/dashboard/stats"),
    tripsPerHour: () => api.get<TripsPerHour[]>("/api/admin/dashboard/trips-per-hour"),
    recentTrips: () => api.get<Trip[]>("/api/admin/dashboard/recent-trips"),
  },
  // Passengers
  passengers: {
    list: (params?: Record<string, string>) => api.get<PaginatedResponse<Passenger>>("/api/admin/passengers", params),
    get: (id: string) => api.get<Passenger>(`/api/admin/passengers/${id}`),
    update: (id: string, data: Partial<Passenger>) => api.patch<Passenger>(`/api/admin/passengers/${id}`, data),
  },
  // Drivers
  drivers: {
    list: (params?: Record<string, string>) => api.get<PaginatedResponse<Driver>>("/api/admin/drivers", params),
    get: (id: string) => api.get<Driver>(`/api/admin/drivers/${id}`),
    approve: (id: string) => api.post<Driver>(`/api/admin/drivers/${id}/approve`),
    reject: (id: string) => api.post<Driver>(`/api/admin/drivers/${id}/reject`),
  },
  // Vehicles
  vehicles: {
    list: (params?: Record<string, string>) => api.get<PaginatedResponse<Vehicle>>("/api/admin/vehicles", params),
    approve: (id: string) => api.post<Vehicle>(`/api/admin/vehicles/${id}/approve`),
    reject: (id: string) => api.post<Vehicle>(`/api/admin/vehicles/${id}/reject`),
  },
  // Trips
  trips: {
    list: (params?: Record<string, string>) => api.get<PaginatedResponse<Trip>>("/api/admin/trips", params),
    get: (id: string) => api.get<TripDetail>(`/api/admin/trips/${id}`),
  },
  // Settings
  settings: {
    get: () => api.get<PlatformSettings>("/api/admin/settings"),
    update: (data: Partial<PlatformSettings>) => api.put<PlatformSettings>("/api/admin/settings", data),
  },
};

// Types
export interface DashboardStats {
  totalTrips: number;
  activeDrivers: number;
  onlinePassengers: number;
  revenueToday: number;
  tripsTrend: number;
  driversTrend: number;
  passengersTrend: number;
  revenueTrend: number;
}

export interface TripsPerHour {
  hour: string;
  trips: number;
  revenue: number;
}

export interface Passenger {
  id: string;
  name: string;
  email: string;
  phone: string;
  tripsCount: number;
  rating: number;
  status: "active" | "inactive" | "suspended";
  joinedDate: string;
  avatarUrl?: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "online" | "offline" | "busy";
  vehicle: string;
  rating: number;
  tripsCount: number;
  approvalStatus: "approved" | "pending" | "rejected";
  joinedDate: string;
  avatarUrl?: string;
  earnings: number;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  category: "economy" | "comfort" | "premium" | "xl";
  driverName: string;
  driverId: string;
  approved: boolean;
  status: "active" | "inactive" | "maintenance";
}

export interface Trip {
  id: string;
  passengerName: string;
  passengerId: string;
  driverName: string;
  driverId: string;
  origin: string;
  destination: string;
  status: "requested" | "accepted" | "arriving" | "in_progress" | "completed" | "cancelled";
  fare: number;
  distance: number;
  duration: number;
  date: string;
  rating?: number;
}

export interface TripTimeline {
  status: string;
  timestamp: string;
  description: string;
}

export interface TripDetail extends Trip {
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  passengerPhone: string;
  driverPhone: string;
  vehicleInfo: string;
  paymentMethod: string;
  paymentStatus: string;
  timeline: TripTimeline[];
  commission: number;
  driverEarnings: number;
}

export interface PlatformSettings {
  pricing: {
    economy: { baseFare: number; perKm: number; perMinute: number; minimumFare: number };
    comfort: { baseFare: number; perKm: number; perMinute: number; minimumFare: number };
    premium: { baseFare: number; perKm: number; perMinute: number; minimumFare: number };
    xl: { baseFare: number; perKm: number; perMinute: number; minimumFare: number };
  };
  commissionRate: number;
  dispatchRadius: number;
  surgeMultiplier: {
    enabled: boolean;
    maxMultiplier: number;
    demandThreshold: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
