import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '../../stores/authStore';

export default function HistoryScreen() {
  const { token } = useAuthStore();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch('http://localhost:3001/trips/passenger/history', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setTrips(data);
        })
        .catch((e) => console.log('Error history', e))
        .finally(() => setLoading(false));
    }
  }, [token]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Viagens</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 40 }} />
      ) : trips.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🚗</Text>
          <Text style={styles.emptyText}>Nenhuma viagem realizada ainda.</Text>
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.date}>
                  {new Date(item.requestedAt).toLocaleDateString('pt-BR')} •{' '}
                  {new Date(item.requestedAt).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                <Text style={styles.fare}>R$ {Number(item.fare || 0).toFixed(2)}</Text>
              </View>

              <Text style={styles.address}>
                🟢 {item.originAddress || 'Origem'}
              </Text>
              <Text style={styles.address}>
                🏁 {item.destAddress || 'Destino'}
              </Text>

              <View style={styles.cardFooter}>
                <Text style={styles.categoryBadge}>
                  {item.category?.toUpperCase()}
                </Text>
                {item.rating && (
                  <Text style={styles.ratingBadge}>⭐ {item.rating} estrelas</Text>
                )}
                <Text style={styles.statusBadge}>{item.status}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  date: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  fare: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4F46E5',
  },
  address: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: '#EEF2FF',
    color: '#4F46E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: '700',
  },
  ratingBadge: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '700',
  },
  statusBadge: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 'auto',
  },
  empty: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
});
