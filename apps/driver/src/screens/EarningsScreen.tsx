import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useDriverStore } from '../stores/driverStore';

export default function EarningsScreen() {
  const { todayEarnings, completedTripsCount } = useDriverStore();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Relatório de Ganhos</Text>

      {/* Hero Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo disponível para saque</Text>
        <Text style={styles.balanceValue}>R$ {todayEarnings.toFixed(2)}</Text>
        <TouchableOpacity style={styles.cashoutBtn}>
          <Text style={styles.cashoutText}>Transferir via PIX</Text>
        </TouchableOpacity>
      </View>

      {/* Week Summary */}
      <View style={styles.statsCard}>
        <Text style={styles.cardHeading}>Resumo Semanal</Text>

        <View style={styles.statGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>R$ {(todayEarnings * 4.2).toFixed(2)}</Text>
            <Text style={styles.statSub}>Ganhos Brutos</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{completedTripsCount * 5}</Text>
            <Text style={styles.statSub}>Corridas</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>28h 40m</Text>
            <Text style={styles.statSub}>Tempo Online</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>⭐ 4.9</Text>
            <Text style={styles.statSub}>Avaliação</Text>
          </View>
        </View>
      </View>

      {/* Daily Breakdown */}
      <View style={styles.daysList}>
        <Text style={styles.cardHeading}>Histórico de Dias</Text>
        <View style={styles.dayRow}>
          <Text style={styles.dayText}>Hoje (Sexta-feira)</Text>
          <Text style={styles.dayAmount}>R$ {todayEarnings.toFixed(2)}</Text>
        </View>
        <View style={styles.dayRow}>
          <Text style={styles.dayText}>Quinta-feira</Text>
          <Text style={styles.dayAmount}>R$ 215,40</Text>
        </View>
        <View style={styles.dayRow}>
          <Text style={styles.dayText}>Quarta-feira</Text>
          <Text style={styles.dayAmount}>R$ 180,90</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 54,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 20,
  },
  balanceCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
  },
  balanceValue: {
    fontSize: 38,
    fontWeight: '950',
    color: '#10B981',
    marginVertical: 10,
  },
  cashoutBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 6,
  },
  cashoutText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statBox: {
    width: '47%',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 14,
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  statSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  daysList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 40,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dayText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  dayAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
});
