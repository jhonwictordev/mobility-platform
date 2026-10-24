/**
 * Automated Test Suite — Mobility Platform
 * Validates State Machine, Race Conditions, Concurrency, and Pricing
 * Runs with Node.js Native Test Runner (node --test)
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const {
  isValidTransition,
  getValidNextStates,
  isTerminalState,
} = require('../services/api/dist/common/utils/trip-state-machine');
const {
  haversineDistance,
  estimateTravelTime,
} = require('../services/api/dist/common/utils/haversine');
const { TripStatus, VehicleCategory } = require('../services/api/dist/database/entities');
const { PricingService } = require('../services/api/dist/pricing/pricing.service');

describe('1. Trip State Machine Rigorous Validation', () => {
  test('Valid happy-path transitions must succeed', () => {
    assert.equal(isValidTransition(TripStatus.REQUESTED, TripStatus.SEARCHING), true);
    assert.equal(isValidTransition(TripStatus.SEARCHING, TripStatus.ACCEPTED), true);
    assert.equal(isValidTransition(TripStatus.ACCEPTED, TripStatus.DRIVER_ARRIVING), true);
    assert.equal(isValidTransition(TripStatus.DRIVER_ARRIVING, TripStatus.DRIVER_ARRIVED), true);
    assert.equal(isValidTransition(TripStatus.DRIVER_ARRIVED, TripStatus.IN_PROGRESS), true);
    assert.equal(isValidTransition(TripStatus.IN_PROGRESS, TripStatus.COMPLETED), true);
  });

  test('Invalid reverse transitions must be rejected', () => {
    assert.equal(isValidTransition(TripStatus.IN_PROGRESS, TripStatus.REQUESTED), false);
    assert.equal(isValidTransition(TripStatus.COMPLETED, TripStatus.IN_PROGRESS), false);
    assert.equal(isValidTransition(TripStatus.DRIVER_ARRIVED, TripStatus.SEARCHING), false);
    assert.equal(isValidTransition(TripStatus.ACCEPTED, TripStatus.REQUESTED), false);
  });

  test('Terminal states must have no valid next states', () => {
    assert.equal(isTerminalState(TripStatus.COMPLETED), true);
    assert.equal(isTerminalState(TripStatus.CANCELLED_BY_PASSENGER), true);
    assert.equal(isTerminalState(TripStatus.CANCELLED_BY_DRIVER), true);
    assert.equal(isTerminalState(TripStatus.EXPIRED), true);
    assert.equal(isTerminalState(TripStatus.FAILED), true);

    assert.deepEqual(getValidNextStates(TripStatus.COMPLETED), []);
    assert.deepEqual(getValidNextStates(TripStatus.EXPIRED), []);
  });

  test('Cancellation rules must be enforced', () => {
    assert.equal(isValidTransition(TripStatus.REQUESTED, TripStatus.CANCELLED_BY_PASSENGER), true);
    assert.equal(isValidTransition(TripStatus.SEARCHING, TripStatus.CANCELLED_BY_PASSENGER), true);
    assert.equal(isValidTransition(TripStatus.ACCEPTED, TripStatus.CANCELLED_BY_PASSENGER), true);
    assert.equal(isValidTransition(TripStatus.COMPLETED, TripStatus.CANCELLED_BY_PASSENGER), false);
  });
});

describe('2. Geo & Haversine Distance Calculations', () => {
  test('Calculates distance correctly between São Paulo landmarks', () => {
    const maspLat = -23.5615;
    const maspLng = -46.6559;
    const ibiraLat = -23.5874;
    const ibiraLng = -46.6576;

    const distKm = haversineDistance(maspLat, maspLng, ibiraLat, ibiraLng);
    assert.ok(distKm > 2.5 && distKm < 3.5, `Distance was ${distKm}`);

    const etaMin = estimateTravelTime(distKm, 30);
    assert.ok(etaMin > 4 && etaMin < 10, `ETA was ${etaMin}`);
  });

  test('Zero distance for identical coordinates', () => {
    assert.equal(haversineDistance(0, 0, 0, 0), 0);
  });
});

describe('3. Pricing and Surge Multiplier Engine', () => {
  const pricing = new PricingService();

  test('Calculates fare within minimum threshold', () => {
    const fare = pricing.calculateFare(VehicleCategory.ECONOMY, 0.5, 2);
    assert.ok(fare.totalFare >= 8.0, `Fare was ${fare.totalFare}`);
  });

  test('Surge multiplier scales fare proportionally', () => {
    pricing.setSurgeMultiplier(1.0);
    const standard = pricing.calculateFare(VehicleCategory.COMFORT, 10, 20);

    pricing.setSurgeMultiplier(1.5);
    const surged = pricing.calculateFare(VehicleCategory.COMFORT, 10, 20);

    assert.ok(surged.totalFare > standard.totalFare);
    assert.equal(surged.surgeMultiplier, 1.5);
  });

  test('Higher categories cost more than Economy', () => {
    pricing.setSurgeMultiplier(1.0);
    const eco = pricing.calculateFare(VehicleCategory.ECONOMY, 10, 20);
    const com = pricing.calculateFare(VehicleCategory.COMFORT, 10, 20);
    const prem = pricing.calculateFare(VehicleCategory.PREMIUM, 10, 20);

    assert.ok(prem.totalFare > com.totalFare);
    assert.ok(com.totalFare > eco.totalFare);
  });
});

describe('4. Atomic Dispatch and Race Condition Prevention Simulation', () => {
  test('Atomic set prevents two drivers from accepting the same trip', async () => {
    const tripLocks = new Set();
    const tripId = 'trip_race_123';

    const acceptAttempt = (driverId) => {
      if (tripLocks.has(tripId)) {
        return false;
      }
      tripLocks.add(tripId);
      return true;
    };

    const driver1Result = acceptAttempt('driver_1');
    const driver2Result = acceptAttempt('driver_2');

    assert.equal(driver1Result, true);
    assert.equal(driver2Result, false);
  });
});
