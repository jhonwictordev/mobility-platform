// ============================================================
// Trip State Machine
// Defines valid state transitions for trips
// ============================================================
import { TripStatus } from '../../database/entities';

/**
 * Map of valid transitions: current state -> allowed next states
 */
const VALID_TRANSITIONS: Record<TripStatus, TripStatus[]> = {
  [TripStatus.REQUESTED]: [
    TripStatus.SEARCHING,
    TripStatus.CANCELLED_BY_PASSENGER,
    TripStatus.FAILED,
  ],
  [TripStatus.SEARCHING]: [
    TripStatus.ACCEPTED,
    TripStatus.EXPIRED,
    TripStatus.CANCELLED_BY_PASSENGER,
    TripStatus.CANCELLED_BY_DRIVER,
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
  // Terminal states — no transitions out
  [TripStatus.COMPLETED]: [],
  [TripStatus.CANCELLED_BY_PASSENGER]: [],
  [TripStatus.CANCELLED_BY_DRIVER]: [],
  [TripStatus.EXPIRED]: [],
  [TripStatus.FAILED]: [],
};

/**
 * Check if a transition from one trip status to another is valid.
 */
export function isValidTransition(
  from: TripStatus,
  to: TripStatus,
): boolean {
  const allowed = VALID_TRANSITIONS[from];
  return allowed ? allowed.includes(to) : false;
}

/**
 * Get all valid next states from the current state.
 */
export function getValidNextStates(current: TripStatus): TripStatus[] {
  return VALID_TRANSITIONS[current] || [];
}

/**
 * Check if a trip status is a terminal (final) state.
 */
export function isTerminalState(status: TripStatus): boolean {
  return VALID_TRANSITIONS[status]?.length === 0;
}

/**
 * Check if a trip status is an active (non-terminal) state.
 */
export function isActiveState(status: TripStatus): boolean {
  return !isTerminalState(status);
}
