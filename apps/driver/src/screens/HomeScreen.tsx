import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { useDriverStore } from '../stores/driverStore';
import { DriverStatus } from '@mobility/shared';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const {
    status,
    driver,
    todayEarnings,
    completedTripsCount,
    incomingOffer,
    activeTrip,
    toggleOnline,
    acceptIncomingOffer,
    declineIncomingOffer,
    setIncomingOffer,
  } = useDriverStore();

  const [countdown, setCountdown] = useState(25);

  const isOnline = status === DriverStatus.ONLINE;

  useEffect(() => {
    if (activeTrip) {
      navigation.navigate('Navigation');
    }
  }, [activeTrip]);

  useEffect(() => {
    let timer: any;
    if (incomingOffer) {
      setCountdown(25);
      timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            declineIncomingOffer();
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [incomingOffer]);

  // Demo helper: simulate incoming trip offer in Alagoas corridor
  const simulateOffer = () => {
    setIncomingOffer({
      tripId: 'simbora_trip_' + Date.now(),
      passengerId: 'p1',
      passengerName: 'Mariana Silva',
      originAddress: 'Praça São Francisco, Piaçabuçu - AL',
      destAddress: 'Largo de São Gonçalo, Centro Histórico, Penedo - AL',
      fare: 38.5,
      category: 'comfort',
      distanceKm: 28.4,
      durationMin: 28,
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Cockpit Header */}
      <View style={styles.topBrandBar}>
        <View style={styles.brandRow}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandLetter}>S</Text>
          </View>
          <View>
            <Text style={styles.brandName}>SIMBORA</Text>
            <Text style={styles.subBrand}>MOTORISTA • ALAGOAS</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.onlineToggle,
            isOnline ? styles.onlineActive : styles.onlineInactive,
          ]}
          onPress={toggleOnline}
        >
          <View
            style={[
              styles.onlineDot,
              { backgroundColor: isOnline ? '#16A572' : '#94A3B8' },
            ]}
          />
          <Text style={styles.onlineToggleText}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Top Status & Earnings Card */}
      <View style={styles.headerCard}>
        <View style={styles.earningsRow}>
          <View>
            <Text style={styles.earningsLabel}>Ganhos de hoje</Text>
            <Text style={styles.earningsValue}>
              R$ {todayEarnings.toFixed(2)}
            </Text>
          </View>
          <View style={styles.tripsBadge}>
            <Text style={styles.tripsText}>{completedTripsCount} corridas</Text>
          </View>
        </View>

        <View style={styles.driverProfileMini}>
          <Text style={styles.driverNameText}>
            {driver?.name || 'Carlos Oliveira'} • ⭐ {driver?.rating || '4.95'}
          </Text>
          <Text style={styles.vehicleText}>
            {driver?.vehicle
              ? `${driver.vehicle.model} (${driver.vehicle.plateNumber})`
              : 'Toyota Corolla Hybrid • BRA2E19'}
          </Text>
        </View>
      </View>

      {/* Map / Heatmap Area */}
      <View style={styles.mapArea}>
        <View style={styles.heatmapBubble1}>
          <Text style={styles.bubbleText}>🔥 Penedo +R$ 5,00</Text>
        </View>
        <View style={styles.heatmapBubble2}>
          <Text style={styles.bubbleText}>🏖️ Peba +R$ 3,50</Text>
        </View>

        <Text style={styles.mapCenterNotice}>
          {isOnline
            ? '🟢 Conectado na AL-101. Aguardando chamadas...'
            : '⚪ Você está OFFLINE. Toque em ONLINE para receber passageiros.'}
        </Text>

        {isOnline && (
          <TouchableOpacity
            style={styles.simulateButton}
            onPress={simulateOffer}
          >
            <Text style={styles.simulateButtonText}>
              ⚡ Simular Chamada: Piaçabuçu ➔ Penedo
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom Dispatch Sheet */}
      <View style={styles.bottomStatusSheet}>
        <View style={styles.radarStatusRow}>
          <View style={styles.radarPulse}>
            <View
              style={[
                styles.pulseCore,
                { backgroundColor: isOnline ? '#16A572' : '#64748B' },
              ]}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.corridorText}>Corredor Piaçabuçu ⇄ Penedo</Text>
            <Text style={styles.corridorSubtext}>
              {isOnline
                ? 'Telemetria GPS enviada a cada 3s • Pronto'
                : 'Conecte-se para começar a faturar hoje'}
            </Text>
          </View>
        </View>
      </View>

      {/* Incoming Ride Offer Modal (25 Seconds Countdown) */}
      <Modal
        visible={!!incomingOffer}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.offerCard}>
            <View style={styles.offerHeader}>
              <View style={styles.timerBadge}>
                <Text style={styles.timerText}>⏱️ {countdown}s</Text>
              </View>
              <Text style={styles.offerFare}>
                R$ {Number(incomingOffer?.fare || 38.5).toFixed(2)}
              </Text>
            </View>

            <View style={styles.passengerSummary}>
              <Text style={styles.passengerName}>
                👤 {incomingOffer?.passengerName || 'Mariana Silva'}
              </Text>
              <Text style={styles.passengerCategory}>
                SIMBORA {incomingOffer?.category?.toUpperCase() || 'COMFORT'}
              </Text>
            </View>

            <View style={styles.routeBox}>
              <View style={styles.routeItem}>
                <Text style={styles.routePin}>🟢</Text>
                <Text style={styles.routeAddress} numberOfLines={1}>
                  {incomingOffer?.originAddress || 'Praça São Francisco, Piaçabuçu'}
                </Text>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routeItem}>
                <Text style={styles.routePin}>🏁</Text>
                <Text style={styles.routeAddress} numberOfLines={1}>
                  {incomingOffer?.destAddress || 'Largo São Gonçalo, Penedo'}
                </Text>
              </View>
            </View>

            <View style={styles.offerMetrics}>
              <Text style={styles.metricText}>
                Distância: <b>{incomingOffer?.distanceKm || 28.4} km</b>
              </Text>
              <Text style={styles.metricText}>
                Duração: <b>~{incomingOffer?.durationMin || 28} min</b>
              </Text>
            </View>

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.declineButton}
                onPress={declineIncomingOffer}
              >
                <Text style={styles.declineButtonText}>RECUSAR</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.acceptButton}
                onPress={acceptIncomingOffer}
              >
                <Text style={styles.acceptButtonText}>ACEITAR CORRIDA</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1412',
  },
  topBrandBar: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: '#123D32',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1A5243',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#17211D',
    borderWidth: 1,
    borderColor: '#FFCC45',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brandLetter: {
    color: '#FFCC45',
    fontWeight: '900',
    fontSize: 16,
  },
  brandName: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1.5,
  },
  subBrand: {
    color: '#FFCC45',
    fontWeight: '800',
    fontSize: 9,
    letterSpacing: 1,
  },
  onlineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  onlineActive: {
    backgroundColor: '#17211D',
    borderWidth: 1.5,
    borderColor: '#16A572',
  },
  onlineInactive: {
    backgroundColor: '#1F2937',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  onlineToggleText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1,
  },
  headerCard: {
    backgroundColor: '#17211D',
    margin: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#284238',
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  earningsLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  earningsValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFCC45',
    marginTop: 2,
  },
  tripsBadge: {
    backgroundColor: '#1E2E28',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#16A572',
  },
  tripsText: {
    color: '#16A572',
    fontWeight: '800',
    fontSize: 11,
  },
  driverProfileMini: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#284238',
  },
  driverNameText: {
    color: '#F8F9F6',
    fontWeight: '800',
    fontSize: 13,
  },
  vehicleText: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  mapArea: {
    flex: 1,
    backgroundColor: '#123D32',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heatmapBubble1: {
    position: 'absolute',
    top: 40,
    right: 30,
    backgroundColor: 'rgba(255, 204, 69, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFCC45',
  },
  heatmapBubble2: {
    position: 'absolute',
    bottom: 90,
    left: 30,
    backgroundColor: 'rgba(22, 165, 114, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#16A572',
  },
  bubbleText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
  },
  mapCenterNotice: {
    color: '#F8F9F6',
    backgroundColor: 'rgba(23, 33, 29, 0.95)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: '#16A572',
    textAlign: 'center',
    maxWidth: '85%',
  },
  simulateButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#FFCC45',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  simulateButtonText: {
    color: '#123D32',
    fontWeight: '900',
    fontSize: 11,
  },
  bottomStatusSheet: {
    backgroundColor: '#17211D',
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: '#284238',
  },
  radarStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radarPulse: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E2E28',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#16A572',
  },
  pulseCore: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  corridorText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  corridorSubtext: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  offerCard: {
    backgroundColor: '#17211D',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    borderTopWidth: 2,
    borderTopColor: '#FFCC45',
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timerBadge: {
    backgroundColor: '#FFCC45',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timerText: {
    color: '#123D32',
    fontWeight: '900',
    fontSize: 13,
  },
  offerFare: {
    color: '#FFCC45',
    fontWeight: '900',
    fontSize: 28,
  },
  passengerSummary: {
    marginBottom: 14,
  },
  passengerName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  passengerCategory: {
    color: '#16A572',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  routeBox: {
    backgroundColor: '#1E2E28',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#284238',
    marginBottom: 14,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routePin: {
    fontSize: 12,
    marginRight: 8,
  },
  routeAddress: {
    color: '#F8F9F6',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  routeLine: {
    width: 2,
    height: 14,
    backgroundColor: '#284238',
    marginLeft: 5,
    marginVertical: 4,
  },
  offerMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 20,
  },
  metricText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#284238',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  declineButtonText: {
    color: '#94A3B8',
    fontWeight: '800',
    fontSize: 13,
  },
  acceptButton: {
    flex: 2,
    backgroundColor: '#16A572',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#16A572',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
});
