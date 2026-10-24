import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import { useDriverStore } from '../stores/driverStore';

export default function AccountScreen() {
  const {
    user,
    driver,
    status,
    todayEarnings,
    completedTripsCount,
    logout,
    updateDriverDetails,
    fetchDriverProfile,
  } = useDriverStore();

  const [legalModal, setLegalModal] = useState<null | { title: string; sections: any[] }>(null);
  const [pixModalVisible, setPixModalVisible] = useState(false);
  const [pixKey, setPixKey] = useState(driver?.pixKey || '');
  const [pixKeyType, setPixKeyType] = useState(driver?.pixKeyType || 'CPF');
  const [cnhCategory, setCnhCategory] = useState(driver?.cnhCategory || 'B');

  const handleSavePix = async () => {
    try {
      await updateDriverDetails({
        pixKey: pixKey.trim(),
        pixKeyType,
        cnhCategory,
      });
      await fetchDriverProfile();
      Alert.alert('Sucesso', 'Dados de repasse PIX atualizados com sucesso!');
      setPixModalVisible(false);
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Falha ao salvar dados');
    }
  };

  const handleOpenLegal = async (type: 'terms' | 'privacy') => {
    try {
      const res = await fetch(`http://localhost:3001/auth/${type}`);
      const data = await res.json();
      setLegalModal({ title: data.title, sections: data.sections || [] });
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar o documento.');
    }
  };

  const isApproved = driver?.approvalStatus === 'approved';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Brand Bar */}
      <View style={styles.brandBar}>
        <View style={styles.brandRow}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandLetter}>S</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>SIMBORA MOTORISTA</Text>
            <Text style={styles.brandSubtitle}>Conta Profissional • Alagoas</Text>
          </View>
        </View>
      </View>

      {/* Driver Card */}
      <View style={styles.card}>
        <View style={styles.avatarRow}>
          <Image
            source={{
              uri:
                user?.avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
            }}
            style={styles.avatar}
          />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{user?.name || 'Motorista Parceiro'}</Text>
            <Text style={styles.driverEmail}>{user?.email}</Text>
            <Text style={styles.driverCnh}>
              CNH: <Text style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{driver?.licenseNumber || 'AL-9876543210'}</Text> (Cat. {driver?.cnhCategory || 'B'})
            </Text>
          </View>
        </View>

        <View style={styles.statusBadgeRow}>
          <View
            style={[
              styles.approvalBadge,
              isApproved ? styles.approvalApproved : styles.approvalPending,
            ]}
          >
            <Text
              style={[
                styles.approvalText,
                isApproved ? styles.approvalTextApproved : styles.approvalTextPending,
              ]}
            >
              {isApproved ? '● CADASTRO APROVADO' : '● EM ANÁLISE PELA PLATAFORMA'}
            </Text>
          </View>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ {driver?.rating || 5.0} ({(driver?.totalTrips || 0) + completedTripsCount} corridas)</Text>
          </View>
        </View>
      </View>

      {/* Driver Performance Summary */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📊 Resumo de Desempenho</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Ganhos de Hoje</Text>
            <Text style={styles.statValue}>R$ {todayEarnings.toFixed(2)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Corridas Concluídas</Text>
            <Text style={styles.statValue}>{completedTripsCount}</Text>
          </View>
        </View>
      </View>

      {/* Financial Payout Settings */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.sectionTitle}>💳 Repasses Financeiros (PIX)</Text>
          <TouchableOpacity onPress={() => setPixModalVisible(true)}>
            <Text style={styles.editLink}>Editar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pixSummary}>
          <Text style={styles.pixLabel}>Chave PIX Cadastrada:</Text>
          <Text style={styles.pixValue}>
            {driver?.pixKey ? `${driver.pixKey} (${driver.pixKeyType || 'PIX'})` : 'Nenhuma chave cadastrada'}
          </Text>
          <Text style={styles.pixHint}>
            Os repasses de viagens em dinheiro ou cartão são transferidos para sua chave PIX diariamente sem taxa.
          </Text>
        </View>
      </View>

      {/* Legal & Compliance */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📜 Regulamentação & Termos</Text>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => handleOpenLegal('terms')}
        >
          <Text style={styles.menuIcon}>⚖️</Text>
          <Text style={styles.menuLabel}>Termos de Parceria e Uso</Text>
          <Text style={styles.menuChevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => handleOpenLegal('privacy')}
        >
          <Text style={styles.menuIcon}>🛡️</Text>
          <Text style={styles.menuLabel}>Privacidade e Dados (LGPD)</Text>
          <Text style={styles.menuChevron}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Encerrar Sessão do Cockpit</Text>
      </TouchableOpacity>

      {/* PIX Modal */}
      <Modal visible={pixModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Configurar Repasse PIX</Text>
            <Text style={styles.modalDesc}>
              Informe sua chave para receber os repasses automáticos do SIMBORA.
            </Text>

            <Text style={styles.inputLabelDark}>Tipo de Chave:</Text>
            <View style={styles.pixTypeRow}>
              {['CPF', 'EMAIL', 'PHONE', 'RANDOM'].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.pixTypeBtn,
                    pixKeyType === t && styles.pixTypeBtnSelected,
                  ]}
                  onPress={() => setPixKeyType(t)}
                >
                  <Text
                    style={[
                      styles.pixTypeText,
                      pixKeyType === t && styles.pixTypeTextSelected,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabelDark}>Chave PIX:</Text>
            <TextInput
              style={styles.inputDark}
              value={pixKey}
              onChangeText={setPixKey}
              placeholder="Digite sua chave PIX"
              placeholderTextColor="#64748B"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabelDark}>Categoria CNH:</Text>
            <View style={styles.pixTypeRow}>
              {['B', 'C', 'D', 'AB'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.pixTypeBtn,
                    cnhCategory === cat && styles.pixTypeBtnSelected,
                  ]}
                  onPress={() => setCnhCategory(cat)}
                >
                  <Text
                    style={[
                      styles.pixTypeText,
                      cnhCategory === cat && styles.pixTypeTextSelected,
                    ]}
                  >
                    Cat. {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setPixModalVisible(false)}
              >
                <Text style={styles.modalCancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSavePix}
              >
                <Text style={styles.modalSaveBtnText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={!!legalModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '80%' }]}>
            <Text style={styles.modalTitle}>{legalModal?.title}</Text>
            <ScrollView style={{ marginVertical: 12 }}>
              {legalModal?.sections.map((sec: any, i: number) => (
                <View key={i} style={{ marginBottom: 12 }}>
                  <Text style={{ fontWeight: '800', color: '#FFCC45', fontSize: 13 }}>
                    {sec.title}
                  </Text>
                  <Text style={{ color: '#CBD5E1', fontSize: 12, marginTop: 4, lineHeight: 18 }}>
                    {sec.content}
                  </Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setLegalModal(null)}
            >
              <Text style={styles.modalCloseText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F0D',
  },
  content: {
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  brandBar: {
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#123D32',
    borderWidth: 2,
    borderColor: '#16A572',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLetter: {
    color: '#FFCC45',
    fontWeight: '900',
    fontSize: 22,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    color: '#16A572',
    fontWeight: '700',
    fontSize: 11,
  },
  card: {
    backgroundColor: '#121D18',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E382B',
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFCC45',
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 17,
  },
  driverEmail: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  driverCnh: {
    color: '#CBD5E1',
    fontSize: 11,
    marginTop: 4,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#1E382B',
  },
  approvalBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  approvalApproved: {
    backgroundColor: 'rgba(22, 165, 114, 0.2)',
  },
  approvalPending: {
    backgroundColor: 'rgba(255, 204, 69, 0.2)',
  },
  approvalText: {
    fontSize: 10,
    fontWeight: '800',
  },
  approvalTextApproved: {
    color: '#16A572',
  },
  approvalTextPending: {
    color: '#FFCC45',
  },
  ratingBadge: {
    backgroundColor: '#172720',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: '#F8F9F6',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    marginBottom: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#0E1713',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E382B',
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  statValue: {
    color: '#16A572',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E382B',
    gap: 12,
  },
  menuIcon: {
    fontSize: 16,
  },
  menuLabel: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  menuChevron: {
    color: '#64748B',
    fontSize: 18,
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: '#2A1215',
    borderWidth: 1,
    borderColor: '#7F1D1D',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '800',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#121D18',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#16A572',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  modalCloseBtn: {
    backgroundColor: '#16A572',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editLink: {
    color: '#FFCC45',
    fontWeight: '800',
    fontSize: 12,
  },
  pixSummary: {
    backgroundColor: '#0E1713',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E382B',
  },
  pixLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  pixValue: {
    color: '#16A572',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
  },
  pixHint: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 6,
    lineHeight: 15,
  },
  modalDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 12,
  },
  inputLabelDark: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  inputDark: {
    backgroundColor: '#0E1713',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E382B',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 13,
  },
  pixTypeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  pixTypeBtn: {
    flex: 1,
    backgroundColor: '#0E1713',
    borderWidth: 1,
    borderColor: '#1E382B',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  pixTypeBtnSelected: {
    backgroundColor: '#123D32',
    borderColor: '#16A572',
  },
  pixTypeText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  pixTypeTextSelected: {
    color: '#FFCC45',
    fontWeight: '800',
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  modalCancelBtn: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalCancelBtnText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
  modalSaveBtn: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#16A572',
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
