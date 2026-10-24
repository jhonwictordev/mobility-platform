import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useTripStore } from '../../stores/tripStore';
import { useAuthStore } from '../../stores/authStore';
import { TripStatus } from '@mobility/shared';

export default function TripScreen({ navigation }: any) {
  const { currentTrip, cancelTrip, rateTrip, reset } = useTripStore();
  const { token } = useAuthStore();
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  const status = currentTrip?.status || TripStatus.SEARCHING;

  const handleCancel = async () => {
    if (token) {
      await cancelTrip(token);
      navigation.navigate('MainTabs');
    }
  };

  const handleFinishRating = async () => {
    if (token && currentTrip) {
      await rateTrip(currentTrip.id, rating, review, token);
      reset();
      navigation.navigate('MainTabs');
    }
  };

  return (
    <View style={styles.container}>
      {/* Live Map Header */}
      <View style={styles.mapArea}>
        <View style={styles.statusPillContainer}>
          <Text style={styles.statusPill}>
            {status === TripStatus.SEARCHING && '🔍 Procurando motorista próximo...'}
            {status === TripStatus.ACCEPTED && '✅ Corrida aceita pelo motorista!'}
            {status === TripStatus.DRIVER_ARRIVING && '🚗 Motorista a caminho do embarque'}
            {status === TripStatus.DRIVER_ARRIVED && '📍 Motorista aguardando no embarque'}
            {status === TripStatus.IN_PROGRESS && '🛣️ Em viagem pela AL-101 / AL-225'}
            {status === TripStatus.COMPLETED && '🎉 Você chegou ao seu destino em Penedo!'}
          </Text>
        </View>

        <View style={styles.radarGraphic}>
          {status === TripStatus.SEARCHING ? (
            <ActivityIndicator size="large" color="#16A572" />
          ) : (
            <View style={styles.vehiclePill}>
              <Text style={{ fontSize: 40 }}>🚗</Text>
            </View>
          )}
        </View>
      </View>

      {/* Trip Information Card with SIMBORA Design System */}
      <View style={styles.card}>
        {status === TripStatus.COMPLETED ? (
          <View style={styles.ratingBox}>
            <Text style={styles.ratingTitle}>Avalie sua viagem com a SIMBORA</Text>
            <Text style={styles.ratingSubtitle}>
              Como foi sua experiência com o motorista parceiro?
            </Text>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Text style={styles.starText}>
                    {star <= rating ? '⭐' : '☆'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.rateButton}
              onPress={handleFinishRating}
            >
              <Text style={styles.rateButtonText}>ENVIAR AVALIAÇÃO</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Driver Details if assigned */}
            {currentTrip?.driver ? (
              <View style={styles.driverSection}>
                <View style={styles.driverRow}>
                  <Image
                    source={{
                      uri:
                        currentTrip.driver.user?.avatar ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
                    }}
                    style={styles.avatar}
                  />
                  <View style={styles.driverInfo}>
                    <Text style={styles.driverName}>
                      {currentTrip.driver.user?.name || 'Carlos Oliveira'}
                    </Text>
                    <Text style={styles.vehicleText}>
                      {currentTrip.driver.vehicle
                        ? `${currentTrip.driver.vehicle.model} • ${currentTrip.driver.vehicle.plateNumber}`
                        : 'Toyota Corolla Hybrid • BRA2E19'}
                    </Text>
                    <Text style={styles.ratingText}>
                      ⭐ {currentTrip.driver.rating || '4.95'} • Motorista Verificado
                    </Text>
                  </View>
                </View>

                {/* Security PIN Box */}
                <View style={styles.pinContainer}>
                  <View>
                    <Text style={styles.pinLabel}>SEU PIN DE SEGURANÇA</Text>
                    <Text style={styles.pinNumber}>7429</Text>
                  </View>
                  <Text style={styles.pinHelp}>
                    Fale este código ao motorista antes de iniciar a viagem.
                  </Text>
                </View>

                {/* Route points */}
                <View style={styles.routeDetails}>
                  <Text style={styles.routeText}>
                    🟢 {currentTrip.originAddress || 'Praça São Francisco, Piaçabuçu'}
                  </Text>
                  <Text style={styles.routeText}>
                    🏁 {currentTrip.destAddress || 'Largo de São Gonçalo, Penedo'}
                  </Text>
                </View>

                {/* Fare & ETA */}
                <View style={styles.fareRow}>
                  <View>
                    <Text style={styles.fareLabel}>Valor Total</Text>
                    <Text style={styles.fareValue}>
                      R$ {Number(currentTrip.fare || 38.5).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>
                      {currentTrip.category?.toUpperCase() || 'COMFORT'}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.searchingPlaceholder}>
                <Text style={styles.searchingTitle}>
                  Conectando aos motoristas da região...
                </Text>
                <Text style={styles.searchingSubtitle}>
                  Verificando condutores disponíveis no trecho Piaçabuçu ⇄ Penedo.
                </Text>
              </View>
            )}

            {/* Cancel Trip Button */}
            {status !== TripStatus.IN_PROGRESS && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>CANCELAR CORRIDA</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#123D32',
  },
  mapArea: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  statusPillContainer: {
    position: 'absolute',
    top: 50,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
  },
  statusPill: {
    backgroundColor: '#123D32',
    color: '#F8F9F6',
    fontWeight: '800',
    fontSize: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#16A572',
    textAlign: 'center',
  },
  radarGraphic: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(22, 165, 114, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#16A572',
  },
  vehiclePill: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  driverSection: {
    marginBottom: 16,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 14,
    borderWidth: 2,
    borderColor: '#16A572',
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#123D32',
  },
  vehicleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginVertical: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  pinContainer: {
    backgroundColor: '#123D32',
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#16A572',
  },
  pinLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#16A572',
    letterSpacing: 1,
  },
  pinNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFCC45',
    letterSpacing: 4,
  },
  pinHelp: {
    fontSize: 10,
    color: '#E2E8F0',
    maxWidth: 130,
    textAlign: 'right',
  },
  routeDetails: {
    backgroundColor: '#F8F9F6',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  routeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#17211D',
    marginVertical: 3,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginBottom: 16,
  },
  fareLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  fareValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#123D32',
  },
  categoryBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  categoryBadgeText: {
    color: '#166534',
    fontWeight: '800',
    fontSize: 11,
  },
  searchingPlaceholder: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  searchingTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#123D32',
    textAlign: 'center',
  },
  searchingSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#EF4444',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },
  ratingBox: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#123D32',
    textAlign: 'center',
  },
  ratingSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  starText: {
    fontSize: 34,
    marginHorizontal: 6,
    color: '#FFCC45',
  },
  rateButton: {
    backgroundColor: '#16A572',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  rateButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1.5,
  },
});
