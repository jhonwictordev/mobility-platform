// Shared types for the Mobility Platform
// Used across passenger app, driver app, admin panel, and API

// ============================================================
// User & Auth Types
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  PASSENGER = 'passenger',
  DRIVER = 'driver',
  ADMIN = 'admin',
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
}

// ============================================================
// Driver Types
// ============================================================

export interface Driver {
  id: string;
  userId: string;
  user?: User;
  licenseNumber: string;
  status: DriverStatus;
  rating: number;
  totalTrips: number;
  currentLat?: number;
  currentLng?: number;
  approvalStatus: ApprovalStatus;
  vehicle?: Vehicle;
  createdAt: string;
  updatedAt: string;
}

export enum DriverStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  BUSY = 'busy',
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// ============================================================
// Vehicle Types
// ============================================================

export interface Vehicle {
  id: string;
  driverId: string;
  make: string;
  model: string;
  year: number;
  color: string;
  plate: string;
  category: VehicleCategory;
  seats: number;
  approved: boolean;
  createdAt: string;
}

export enum VehicleCategory {
  ECONOMY = 'economy',
  COMFORT = 'comfort',
  PREMIUM = 'premium',
}

// ============================================================
// Trip Types
// ============================================================

export interface Trip {
  id: string;
  passengerId: string;
  passenger?: User;
  driverId?: string;
  driver?: Driver;
  vehicleId?: string;
  vehicle?: Vehicle;
  status: TripStatus;
  originLat: number;
  originLng: number;
  originAddress: string;
  destLat: number;
  destLng: number;
  destAddress: string;
  distanceKm?: number;
  durationMin?: number;
  fare?: number;
  category: VehicleCategory;
  requestedAt: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  rating?: number;
  review?: string;
}

export enum TripStatus {
  REQUESTED = 'REQUESTED',
  SEARCHING = 'SEARCHING',
  ACCEPTED = 'ACCEPTED',
  DRIVER_ARRIVING = 'DRIVER_ARRIVING',
  DRIVER_ARRIVED = 'DRIVER_ARRIVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED_BY_PASSENGER = 'CANCELLED_BY_PASSENGER',
  CANCELLED_BY_DRIVER = 'CANCELLED_BY_DRIVER',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
}

// Valid state transitions
export const VALID_TRIP_TRANSITIONS: Record<TripStatus, TripStatus[]> = {
  [TripStatus.REQUESTED]: [
    TripStatus.SEARCHING,
    TripStatus.CANCELLED_BY_PASSENGER,
    TripStatus.FAILED,
  ],
  [TripStatus.SEARCHING]: [
    TripStatus.ACCEPTED,
    TripStatus.EXPIRED,
    TripStatus.CANCELLED_BY_PASSENGER,
    TripStatus.FAILED,
  ],
  [TripStatus.ACCEPTED]: [
    TripStatus.DRIVER_ARRIVING,
    TripStatus.CANCELLED_BY_PASSENGER,
    TripStatus.CANCELLED_BY_DRIVER,
    TripStatus.FAILED,
  ],
  [TripStatus.DRIVER_ARRIVING]: [
    TripStatus.DRIVER_ARRIVED,
    TripStatus.CANCELLED_BY_PASSENGER,
    TripStatus.CANCELLED_BY_DRIVER,
    TripStatus.FAILED,
  ],
  [TripStatus.DRIVER_ARRIVED]: [
    TripStatus.IN_PROGRESS,
    TripStatus.CANCELLED_BY_PASSENGER,
    TripStatus.FAILED,
  ],
  [TripStatus.IN_PROGRESS]: [
    TripStatus.COMPLETED,
    TripStatus.FAILED,
  ],
  [TripStatus.COMPLETED]: [],
  [TripStatus.CANCELLED_BY_PASSENGER]: [],
  [TripStatus.CANCELLED_BY_DRIVER]: [],
  [TripStatus.EXPIRED]: [],
  [TripStatus.FAILED]: [],
};

export function isValidTransition(from: TripStatus, to: TripStatus): boolean {
  return VALID_TRIP_TRANSITIONS[from]?.includes(to) ?? false;
}

// ============================================================
// Location Types
// ============================================================

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationUpdate {
  driverId: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  timestamp: string;
}

export interface RouteInfo {
  distanceKm: number;
  durationMin: number;
  polyline?: string; // encoded polyline
}

// ============================================================
// Pricing Types
// ============================================================

export interface PriceEstimate {
  category: VehicleCategory;
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  surgeMultiplier: number;
  totalFare: number;
  currency: string;
  estimatedDurationMin: number;
  estimatedDistanceKm: number;
}

export interface CategoryPricing {
  category: VehicleCategory;
  baseFare: number;
  perKmRate: number;
  perMinRate: number;
  minimumFare: number;
  surgeMultiplier: number;
}

// Default pricing configuration (BRL)
export const DEFAULT_PRICING: Record<VehicleCategory, Omit<CategoryPricing, 'surgeMultiplier'>> = {
  [VehicleCategory.ECONOMY]: {
    category: VehicleCategory.ECONOMY,
    baseFare: 5.00,
    perKmRate: 1.50,
    perMinRate: 0.25,
    minimumFare: 8.00,
  },
  [VehicleCategory.COMFORT]: {
    category: VehicleCategory.COMFORT,
    baseFare: 7.00,
    perKmRate: 2.20,
    perMinRate: 0.35,
    minimumFare: 12.00,
  },
  [VehicleCategory.PREMIUM]: {
    category: VehicleCategory.PREMIUM,
    baseFare: 10.00,
    perKmRate: 3.50,
    perMinRate: 0.50,
    minimumFare: 18.00,
  },
};

// ============================================================
// Payment Types
// ============================================================

export interface Payment {
  id: string;
  tripId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: string;
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PIX = 'pix',
  CASH = 'cash',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

// ============================================================
// Document Types
// ============================================================

export interface DriverDocument {
  id: string;
  driverId: string;
  type: DocumentType;
  fileUrl: string;
  status: ApprovalStatus;
  reviewNotes?: string;
  createdAt: string;
}

export enum DocumentType {
  CNH = 'cnh',
  VEHICLE_REGISTRATION = 'vehicle_registration',
  CRIMINAL_RECORD = 'criminal_record',
  PROFILE_PHOTO = 'profile_photo',
}

// ============================================================
// WebSocket Event Types
// ============================================================

export enum WsEvent {
  // Connection
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  
  // Trip lifecycle
  TRIP_REQUESTED = 'trip:requested',
  TRIP_SEARCHING = 'trip:searching',
  TRIP_DRIVER_FOUND = 'trip:driver_found',
  TRIP_ACCEPTED = 'trip:accepted',
  TRIP_DRIVER_ARRIVING = 'trip:driver_arriving',
  TRIP_DRIVER_ARRIVED = 'trip:driver_arrived',
  TRIP_STARTED = 'trip:started',
  TRIP_COMPLETED = 'trip:completed',
  TRIP_CANCELLED = 'trip:cancelled',
  TRIP_EXPIRED = 'trip:expired',
  
  // Driver events
  DRIVER_LOCATION_UPDATE = 'driver:location_update',
  DRIVER_STATUS_CHANGED = 'driver:status_changed',
  DRIVER_TRIP_REQUEST = 'driver:trip_request',
  DRIVER_TRIP_RESPONSE = 'driver:trip_response',
  
  // Admin events
  ADMIN_TRIP_UPDATE = 'admin:trip_update',
  ADMIN_DRIVER_UPDATE = 'admin:driver_update',
}

export interface WsTripRequestPayload {
  tripId: string;
  passenger: Pick<User, 'id' | 'name' | 'avatar'>;
  origin: Coordinates & { address: string };
  destination: Coordinates & { address: string };
  category: VehicleCategory;
  estimatedFare: number;
  estimatedDistanceKm: number;
  estimatedDurationMin: number;
  expiresAt: string;
}

export interface WsDriverLocationPayload {
  driverId: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  tripId?: string;
}

// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================
// Utility: Haversine Distance Calculation
// ============================================================

const EARTH_RADIUS_KM = 6371;

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// ============================================================
// Constants
// ============================================================

export const DISPATCH_RADIUS_KM = 5;
export const DISPATCH_TIMEOUT_SECONDS = 30;
export const MAX_DISPATCH_ATTEMPTS = 10;
export const LOCATION_UPDATE_INTERVAL_MS = 3000;
