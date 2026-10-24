import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const DOCUMENTS = [
  {
    id: 'cnh',
    title: 'CNH com EAR',
    desc: 'Carteira Nacional de Habilitação com atividade remunerada',
    status: 'APROVADO',
    statusColor: '#10B981',
    expiry: 'Validade: 12/2028',
  },
  {
    id: 'crlv',
    title: 'CRLV do Veículo',
    desc: 'Licenciamento anual 2024 (Toyota Corolla)',
    status: 'APROVADO',
    statusColor: '#10B981',
    expiry: 'Exercício 2024',
  },
  {
    id: 'antecedentes',
    title: 'Atestado de Antecedentes Criminais',
    desc: 'Certidão emitida pela Polícia Federal / Estadual',
    status: 'APROVADO',
    statusColor: '#10B981',
    expiry: 'Emitido há 45 dias',
  },
  {
    id: 'foto',
    title: 'Foto de Perfil',
    desc: 'Selfie nítida com fundo neutro sem óculos escuros',
    status: 'APROVADO',
    statusColor: '#10B981',
    expiry: 'Verificado biometricamente',
  },
];

export default function DocumentsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Documentos e Cadastro</Text>
      <Text style={styles.subtitle}>
        Mantenha seus documentos em dia para continuar recebendo viagens.
      </Text>

      <View style={styles.statusBanner}>
        <Text style={styles.bannerIcon}>✅</Text>
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>Conta 100% Aprovada</Text>
          <Text style={styles.bannerDesc}>
            Você está apto a dirigir em todas as categorias elegíveis.
          </Text>
        </View>
      </View>

      <View style={styles.docList}>
        {DOCUMENTS.map((doc) => (
          <View key={doc.id} style={styles.docCard}>
            <View style={styles.docHeader}>
              <Text style={styles.docTitle}>{doc.title}</Text>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: doc.statusColor + '20' },
                ]}
              >
                <Text style={[styles.badgeText, { color: doc.statusColor }]}>
                  {doc.status}
                </Text>
              </View>
            </View>

            <Text style={styles.docDesc}>{doc.desc}</Text>
            <Text style={styles.docExpiry}>{doc.expiry}</Text>

            <TouchableOpacity style={styles.reuploadBtn}>
              <Text style={styles.reuploadText}>Atualizar Arquivo</Text>
            </TouchableOpacity>
          </View>
        ))}
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
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 20,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  bannerIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#065F46',
  },
  bannerDesc: {
    fontSize: 12,
    color: '#047857',
    marginTop: 2,
  },
  docList: {
    gap: 12,
    paddingBottom: 40,
  },
  docCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  docHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  docTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  docDesc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  docExpiry: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 6,
    fontWeight: '600',
  },
  reuploadBtn: {
    marginTop: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    alignItems: 'center',
  },
  reuploadText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },
});
