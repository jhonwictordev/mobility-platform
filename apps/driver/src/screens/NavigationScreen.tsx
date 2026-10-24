import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { useDriverStore } from '../stores/driverStore';
import { TripStatus } from '@mobility/shared';

export default function NavigationScreen({ navigation }: any) {
  const { activeTrip, updateTripStatus, sendLocationUpdate } = useDriverStore();
  const [pin, setPin] = useState('');

  const status = activeTrip?.status || TripStatus.ACCEPTED;

  // Periodically send GPS telemetry to backend centered on Alagoas corridor
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate GPS telemetry along AL-101 / AL-225
      const deltaLat = (Math.random() - 0.5) * 0.001;
      const deltaLng = (Math.random() - 0.5) * 0.001;
      sendLocationUpdate(-10.35 + deltaLat, -36.50 + deltaLng);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleArrived = async () => {
    await updateTripStatus(TripStatus.DRIVER_ARRIVED);
  };

  const handleStartTrip = async () => {
    if (pin.trim().length < 4) {
      Alert.alert(
        'PIN Obrigatório',
        'Peça o código PIN de 4 dígitos ao passageiro para iniciar a corrida com segurança.',
      );
      return;
    }
    try {
      await updateTripStatus(TripStatus.IN_PROGRESS, pin.trim());
    } catch (err: any) {
      Alert.alert('PIN Inválido', err.message || 'Código PIN incorreto');
    }
  };

  const handleCompleteTrip = async () => {
    await updateTripStatus(TripStatus.COMPLETED);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      {/* Top Brand Bar */}
      <View style={styles.topBar}>
        <Text style={styles.brandTitle}>SIMBORA MOTORISTA</Text>
        <Text style={styles.gpsBadge}>🛰️ GPS ALAGOAS ATIVO</Text>
      </View>

      {/* Navigation Map HUD */}
      <View style={styles.hudMap}>
        <View style={styles.turnCard}>
          <Text style={styles.turnIcon}>⬆</Text>
          <View style={styles.turnInfo}>
            <Text style={styles.turnDist}>Em 800m</Text>
            <Text style={styles.turnStreet}>
              {status === TripStatus.IN_PROGRESS
                ? 'Siga pela Rodovia AL-101 Sul / AL-225 rumo a Penedo'
                : 'Acesse a Rua Silvestre Péricles rumo à Praça São Francisco'}
            </Text>
          </View>
        </View>

        <View style={styles.carGraphic}>
          <Text style={{ fontSize: 44 }}>🏎️</Text>
        </View>
      </View>

      {/* Driver Controls Bottom Sheet */}
      <View style={styles.controlsSheet}>
        <View style={styles.passengerRow}>
          <View style={styles.avatarCircle}>
            <Text style={{ fontSize: 22 }}>👤</Text>
          </View>
          <View style={styles.passengerText}>
            <Text style={styles.passengerName}>
              {activeTrip?.passenger?.name || 'Mariana Silva'}
            </Text>
            <Text style={styles.categoryBadgeText}>
              SIMBORA {activeTrip?.category?.toUpperCase() || 'COMFORT'} • R${' '}
              {Number(activeTrip?.fare || 38.5).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.destinationBox}>
          <Text style={styles.destLabel}>
            {status === TripStatus.IN_PROGRESS ? 'DESTINO FINAL:' : 'PONTO DE EMBARQUE:'}
          </Text>
          <Text style={styles.destAddress}>
            {status === TripStatus.IN_PROGRESS
              ? activeTrip?.destAddress || 'Largo de São Gonçalo, Centro Histórico, Penedo - AL'
              : activeTrip?.originAddress || 'Praça São Francisco, Piaçabuçu - AL'}
          </Text>
        </View>

        {/* Dynamic Action Button by Status */}
        {status === TripStatus.ACCEPTED || status === TripStatus.DRIVER_ARRIVING ? (
          <TouchableOpacity style={styles.primaryBtn} onPress={handleArrived}>
            <Text style={styles.primaryBtnText}>CHEGUEI AO EMBARQUE</Text>
          </TouchableOpacity>
        ) : status === TripStatus.DRIVER_ARRIVED ? (
          <View style={styles.pinSection}>
            <Text style={styles.pinHelpText}>
              Solicite o PIN de 4 dígitos do passageiro:
            </Text>
            <TextInput
              style={styles.pinInput}
              placeholder="Digite o PIN (ex: 7429)"
              placeholderTextColor="#64748B"
              keyboardType="number-pad"
              maxLength={4}
              value={pin}
              onChangeText={setPin}
            />
            <TouchableOpacity style={styles.primaryBtn} onPress={handleStartTrip}>
              <Text style={styles.primaryBtnText}>VALIDAR PIN & INICIAR</Text>
            </TouchableOpacity>
          </View>
        ) : status === TripStatus.IN_PROGRESS ? (
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: '#16A572' }]}
            onPress={handleCompleteTrip}
          >
            <Text style={styles.primaryBtnText}>FINALIZAR VIAGEM EM PENEDO</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1412',
  },
  topBar: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#123D32',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1A5243',
  },
  brandTitle: {
    color: '#F8F9F6',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1.5,
  },
  gpsBadge: {
    color: '#16A572',
    fontWeight: '800',
    fontSize: 10,
  },
  hudMap: {
    flex: 1,
    backgroundColor: '#17211D',
    justifyContent: 'space-between',
    padding: 20,
  },
  turnCard: {
    backgroundColor: 'rgba(18, 61, 50, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#16A572',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  turnIcon: {
    fontSize: 32,
    color: '#FFCC45',
    marginRight: 16,
    fontWeight: '900',
  },
  turnInfo: {
    flex: 1,
  },
  turnDist: {
    color: '#FFCC45',
    fontSize: 18,
    fontWeight: '900',
  },
  turnStreet: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  carGraphic: {
    alignSelf: 'center',
    marginBottom: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E2E28',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#16A572',
  },
  controlsSheet: {
    backgroundColor: '#17211D',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#284238',
  },
  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E2E28',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#16A572',
    marginRight: 14,
  },
  passengerText: {
    flex: 1,
  },
  passengerName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  categoryBadgeText: {
    color: '#FFCC45',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  destinationBox: {
    backgroundColor: '#1E2E28',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#284238',
    marginBottom: 18,
  },
  destLabel: {
    color: '#16A572',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  destAddress: {
    color: '#F8F9F6',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  primaryBtn: {
    backgroundColor: '#FFCC45',
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#FFCC45',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#123D32',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  pinSection: {
    gap: 12,
  },
  pinHelpText: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  pinInput: {
    backgroundColor: '#0E1412',
    borderWidth: 1.5,
    borderColor: '#16A572',
    borderRadius: 16,
    padding: 14,
    color: '#FFCC45',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 6,
  },
});
