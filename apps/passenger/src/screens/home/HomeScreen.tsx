import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { useTripStore } from '../../stores/tripStore';
import { VehicleCategory } from '@mobility/shared';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  {
    id: VehicleCategory.ECONOMY,
    name: 'Simbora Econômico',
    desc: 'Viagens ágeis e econômicas',
    icon: '🚗',
    multiplier: 1.0,
  },
  {
    id: VehicleCategory.COMFORT,
    name: 'Simbora Conforto',
    desc: 'Carros novos com ar condicionado',
    icon: '🚙',
    multiplier: 1.4,
  },
  {
    id: VehicleCategory.PREMIUM,
    name: 'Simbora Intermunicipal',
    desc: 'Penedo ⇄ Piaçabuçu com conforto',
    icon: '✨',
    multiplier: 2.1,
  },
];

export default function HomeScreen({ navigation }: any) {
  const { token, user } = useAuthStore();
  const {
    origin,
    destination,
    selectedCategory,
    priceEstimates,
    isRequesting,
    currentTrip,
    setOrigin,
    setDestination,
    setCategory,
    setPriceEstimates,
    requestTrip,
  } = useTripStore();

  const [originInput, setOriginInput] = useState(
    'Praça São Francisco de Borja, 100 - Centro, Piaçabuçu - AL',
  );
  const [destInput, setDestInput] = useState(
    'Largo de São Gonçalo, s/n - Centro Histórico, Penedo - AL',
  );
  const [isFetchingEstimates, setIsFetchingEstimates] = useState(false);

  useEffect(() => {
    // Alagoas default coordinates: Piaçabuçu -> Penedo
    const pOrigin = { lat: -10.4058, lng: -36.4344, address: originInput };
    const pDest = { lat: -10.2917, lng: -36.5819, address: destInput };

    setOrigin(pOrigin);
    setDestination(pDest);
    fetchEstimates(pOrigin.lat, pOrigin.lng, pDest.lat, pDest.lng);
  }, []);

  useEffect(() => {
    if (currentTrip) {
      navigation.navigate('Trip');
    }
  }, [currentTrip]);

  const fetchEstimates = async (
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number,
  ) => {
    setIsFetchingEstimates(true);
    try {
      const res = await fetch(
        `http://localhost:3001/pricing/estimate?fromLat=${fromLat}&fromLng=${fromLng}&toLat=${toLat}&toLng=${toLng}`,
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setPriceEstimates(data);
      }
    } catch (e) {
      console.log('Error fetching estimates', e);
    } finally {
      setIsFetchingEstimates(false);
    }
  };

  const handleRequestRide = async () => {
    if (token) {
      await requestTrip(token);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Brand Bar */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandLetter}>S</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>SIMBORA</Text>
            <Text style={styles.brandSlogan}>Pediu. Chegou. Simbora!</Text>
          </View>
        </View>
        <View style={styles.userBadge}>
          <Text style={styles.userBadgeText}>
            {user?.name ? user.name.split(' ')[0] : 'Mariana'}
          </Text>
        </View>
      </View>

      {/* Map View Placeholder / Visual Map Background */}
      <View style={styles.mapContainer}>
        <View style={styles.mapGraphic}>
          <Text style={styles.mapLabel}>🗺️ Alagoas • Penedo ⇄ Piaçabuçu (AL-101)</Text>
          <View style={styles.markerPickup}>
            <Text style={styles.markerText}>📍 Piaçabuçu (Foz)</Text>
          </View>
          <View style={styles.routeDotted} />
          <View style={styles.markerDest}>
            <Text style={styles.markerText}>🏁 Penedo (Centro Histórico)</Text>
          </View>
          <View style={styles.driverDot}>
            <Text style={styles.driverText}>🚗 Carlos (3 min)</Text>
          </View>
          <View style={styles.driverDot2}>
            <Text style={styles.driverText}>🚙 Amanda (5 min)</Text>
          </View>
        </View>
      </View>

      {/* Floating Bottom Sheet with SIMBORA Design System */}
      <View style={styles.sheetContainer}>
        <View style={styles.dragHandle} />

        <View style={styles.searchBox}>
          <View style={styles.inputRow}>
            <Text style={styles.pinIcon}>🟢</Text>
            <TextInput
              style={styles.addressInput}
              value={originInput}
              onChangeText={setOriginInput}
              placeholder="Local de embarque em Piaçabuçu"
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.inputRow}>
            <Text style={styles.pinIcon}>🏁</Text>
            <TextInput
              style={styles.addressInput}
              value={destInput}
              onChangeText={setDestInput}
              placeholder="Destino em Penedo ou região"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Categories Selection */}
        <Text style={styles.sectionTitle}>Escolha a sua categoria SIMBORA</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const estimate = priceEstimates.find((e) => e.category === cat.id);

            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCard,
                  isSelected && styles.categoryCardSelected,
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={styles.categoryName}>{cat.name}</Text>
                <Text style={styles.categoryDesc}>{cat.desc}</Text>
                <Text style={styles.categoryPrice}>
                  {estimate ? `R$ ${estimate.totalFare.toFixed(2)}` : 'Calculando...'}
                </Text>
                {estimate && (
                  <Text style={styles.categoryEta}>
                    ⏱️ ~{estimate.durationMin} min
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Action Button: PEDIR SIMBORA */}
        <TouchableOpacity
          style={styles.requestButton}
          onPress={handleRequestRide}
          disabled={isRequesting}
        >
          {isRequesting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.requestButtonText}>
              PEDIR SIMBORA • {selectedCategory.toUpperCase()}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9F6',
  },
  topBar: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: '#123D32',
    flexDirection: 'row',
    justifyContent: 'between',
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
    borderColor: '#16A572',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brandLetter: {
    color: '#FFCC45',
    fontWeight: '900',
    fontSize: 16,
  },
  brandTitle: {
    color: '#F8F9F6',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1.5,
  },
  brandSlogan: {
    color: '#16A572',
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  userBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#16A572',
  },
  userBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapGraphic: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E8F0EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapLabel: {
    position: 'absolute',
    top: 16,
    fontSize: 13,
    fontWeight: '800',
    color: '#123D32',
    backgroundColor: 'rgba(248, 249, 246, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#16A572',
    shadowColor: '#123D32',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  markerPickup: {
    position: 'absolute',
    top: '30%',
    left: '18%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#16A572',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  markerDest: {
    position: 'absolute',
    top: '52%',
    right: '18%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#FFCC45',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeDotted: {
    position: 'absolute',
    width: 160,
    height: 100,
    borderWidth: 3,
    borderColor: '#16A572',
    borderStyle: 'dashed',
    borderRadius: 24,
    top: '36%',
  },
  driverDot: {
    position: 'absolute',
    top: '24%',
    right: '25%',
    backgroundColor: '#123D32',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    elevation: 2,
  },
  driverDot2: {
    position: 'absolute',
    bottom: '48%',
    left: '15%',
    backgroundColor: '#123D32',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    elevation: 2,
  },
  driverText: {
    color: '#F8F9F6',
    fontWeight: '700',
    fontSize: 10,
  },
  markerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#123D32',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    shadowColor: '#123D32',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  dragHandle: {
    width: 44,
    height: 5,
    backgroundColor: '#CBD5E1',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  searchBox: {
    backgroundColor: '#F8F9F6',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinIcon: {
    fontSize: 14,
    marginRight: 10,
  },
  addressInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#17211D',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
    marginLeft: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#123D32',
    marginBottom: 10,
  },
  categoryScroll: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryCard: {
    width: 135,
    backgroundColor: '#F8F9F6',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
  },
  categoryCardSelected: {
    borderColor: '#16A572',
    backgroundColor: '#ECFDF5',
  },
  categoryIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#123D32',
    textAlign: 'center',
  },
  categoryDesc: {
    fontSize: 9,
    color: '#64748B',
    textAlign: 'center',
    marginVertical: 3,
  },
  categoryPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: '#123D32',
    marginTop: 2,
  },
  categoryEta: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16A572',
    marginTop: 2,
  },
  requestButton: {
    backgroundColor: '#16A572',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#16A572',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  requestButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});
