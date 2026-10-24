import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '../../stores/authStore';

export default function ProfileScreen() {
  const {
    user,
    token,
    savedPlaces,
    isLoading,
    logout,
    fetchProfile,
    updateProfile,
    changePassword,
    deleteAccount,
    sendOtp,
    verifyOtp,
    loadSavedPlaces,
    addSavedPlace,
    deleteSavedPlace,
  } = useAuthStore();

  // Modals state
  const [modalMode, setModalMode] = useState<'none' | 'editProfile' | 'otp' | 'addPlace' | 'password' | 'terms' | 'privacy'>('none');

  // Edit profile form
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [phoneInput, setPhoneInput] = useState(user?.phone || '');
  const [categoryPref, setCategoryPref] = useState('comfort');

  // OTP state
  const [otpCode, setOtpCode] = useState('');
  const [otpSentCode, setOtpSentCode] = useState<string | null>(null);

  // Add place form
  const [placeLabel, setPlaceLabel] = useState('Casa');
  const [placeAddress, setPlaceAddress] = useState('');

  // Password change form
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');

  // Legal texts state
  const [legalTitle, setLegalTitle] = useState('');
  const [legalContent, setLegalContent] = useState<any[]>([]);

  useEffect(() => {
    fetchProfile();
    loadSavedPlaces();
  }, []);

  const handleOpenEditProfile = () => {
    setNameInput(user?.name || '');
    setPhoneInput(user?.phone || '');
    setModalMode('editProfile');
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        name: nameInput,
        phone: phoneInput,
        preferences: { preferredCategory: categoryPref },
      });
      setModalMode('none');
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    }
  };

  const handleSendOtp = async () => {
    try {
      const res = await sendOtp(user?.phone || user?.email || '');
      if (res.code) {
        setOtpSentCode(res.code);
        setOtpCode(res.code); // auto-fill in demo mode
      }
      setModalMode('otp');
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    }
  };

  const handleConfirmOtp = async () => {
    try {
      await verifyOtp(user?.phone || user?.email || '', otpCode);
      setModalMode('none');
      Alert.alert('Verificado', 'Seu número de telefone foi verificado com sucesso!');
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    }
  };

  const handleAddPlace = async () => {
    if (!placeAddress) {
      Alert.alert('Atenção', 'Digite o endereço');
      return;
    }
    // Default Alagoas coordinates based on preset or region
    const lat = placeLabel === 'Casa' ? -10.2897 : -10.4058;
    const lng = placeLabel === 'Casa' ? -36.5864 : -36.4344;
    await addSavedPlace({
      label: placeLabel,
      address: placeAddress,
      lat,
      lng,
    });
    setPlaceAddress('');
    setModalMode('none');
  };

  const handleChangePassword = async () => {
    if (!currentPass || !newPass) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }
    try {
      await changePassword(currentPass, newPass);
      setCurrentPass('');
      setNewPass('');
      setModalMode('none');
      Alert.alert('Sucesso', 'Sua senha foi alterada com sucesso!');
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    }
  };

  const handleOpenLegal = async (type: 'terms' | 'privacy') => {
    try {
      const res = await fetch(`http://localhost:3001/auth/${type}`);
      const data = await res.json();
      setLegalTitle(data.title);
      setLegalContent(data.sections || []);
      setModalMode(type);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar os termos');
    }
  };

  const handleDeleteAccountConfirm = () => {
    Alert.alert(
      'Desativar Conta',
      'Tem certeza que deseja desativar sua conta SIMBORA? Seus dados serão protegidos conforme a LGPD.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desativar',
          style: 'destructive',
          onPress: async () => {
            await deleteAccount();
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Profile Card */}
      <View style={styles.profileHeaderCard}>
        <View style={styles.avatarRow}>
          <Image
            source={{
              uri:
                user?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
            }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.name}>{user?.name || 'Passageiro SIMBORA'}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            <View style={styles.phoneBadgeRow}>
              <Text style={styles.phone}>{user?.phone || 'Sem telefone'}</Text>
              {user?.phoneVerified ? (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓ Verificado</Text>
                </View>
              ) : (
                <TouchableOpacity style={styles.unverifiedBadge} onPress={handleSendOtp}>
                  <Text style={styles.unverifiedText}>Verificar Telefone</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.editProfileButton} onPress={handleOpenEditProfile}>
          <Text style={styles.editProfileText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Saved Places (Minha Conta) */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📍 Lugares Salvos</Text>
          <TouchableOpacity
            style={styles.addPlaceButton}
            onPress={() => setModalMode('addPlace')}
          >
            <Text style={styles.addPlaceText}>+ Adicionar</Text>
          </TouchableOpacity>
        </View>

        {savedPlaces.length === 0 ? (
          <Text style={styles.emptyText}>
            Nenhum endereço salvo. Salve sua Casa ou Trabalho para pedir corridas mais rápido!
          </Text>
        ) : (
          savedPlaces.map((place) => (
            <View key={place.id} style={styles.placeRow}>
              <View style={styles.placeIconCircle}>
                <Text style={{ fontSize: 16 }}>
                  {place.label.toLowerCase() === 'casa'
                    ? '🏠'
                    : place.label.toLowerCase() === 'trabalho'
                    ? '💼'
                    : '⭐'}
                </Text>
              </View>
              <View style={styles.placeDetails}>
                <Text style={styles.placeLabel}>{place.label}</Text>
                <Text style={styles.placeAddress} numberOfLines={1}>
                  {place.address}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => deleteSavedPlace(place.id)}
                style={styles.deletePlaceButton}
              >
                <Text style={styles.deletePlaceText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* Travel Preferences */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🚗 Preferências de Viagem</Text>
        <Text style={styles.prefSubtitle}>Categoria preferida para viagens em Alagoas:</Text>
        <View style={styles.categoryPrefRow}>
          {[
            { id: 'economy', label: 'Econômico', icon: '🚗' },
            { id: 'comfort', label: 'Conforto', icon: '🚙' },
            { id: 'premium', label: 'Intermunicipal', icon: '✨' },
          ].map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryPrefBadge,
                categoryPref === cat.id && styles.categoryPrefBadgeActive,
              ]}
              onPress={() => {
                setCategoryPref(cat.id);
                updateProfile({ preferences: { preferredCategory: cat.id } });
              }}
            >
              <Text style={{ fontSize: 18 }}>{cat.icon}</Text>
              <Text
                style={[
                  styles.categoryPrefText,
                  categoryPref === cat.id && styles.categoryPrefTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Settings & Security Options */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>⚙️ Conta e Segurança</Text>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => setModalMode('password')}
        >
          <Text style={styles.menuIcon}>🔒</Text>
          <Text style={styles.menuLabel}>Alterar Senha de Acesso</Text>
          <Text style={styles.menuChevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => handleOpenLegal('terms')}
        >
          <Text style={styles.menuIcon}>📜</Text>
          <Text style={styles.menuLabel}>Termos e Condições de Uso</Text>
          <Text style={styles.menuChevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => handleOpenLegal('privacy')}
        >
          <Text style={styles.menuIcon}>🛡️</Text>
          <Text style={styles.menuLabel}>Privacidade e LGPD</Text>
          <Text style={styles.menuChevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={handleDeleteAccountConfirm}
        >
          <Text style={styles.menuIcon}>⚠️</Text>
          <Text style={[styles.menuLabel, { color: '#DC2626' }]}>
            Desativar Minha Conta
          </Text>
          <Text style={styles.menuChevron}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>

      {/* ================= MODAL: EDIT PROFILE ================= */}
      <Modal visible={modalMode === 'editProfile'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <Text style={styles.modalLabel}>Nome Completo:</Text>
            <TextInput
              style={styles.modalInput}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Seu nome"
            />
            <Text style={styles.modalLabel}>Telefone Celular (com DDD):</Text>
            <TextInput
              style={styles.modalInput}
              value={phoneInput}
              onChangeText={setPhoneInput}
              placeholder="82999998888"
              keyboardType="phone-pad"
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setModalMode('none')}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleSaveProfile}
              >
                <Text style={styles.modalSubmitText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL: OTP VERIFICATION ================= */}
      <Modal visible={modalMode === 'otp'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Verificação por Telefone</Text>
            <Text style={styles.modalSubtitle}>
              Digite o código de 6 dígitos enviado para {user?.phone || user?.email}:
            </Text>
            {otpSentCode && (
              <View style={styles.otpDemoBox}>
                <Text style={styles.otpDemoText}>Código de Teste: {otpSentCode}</Text>
              </View>
            )}
            <TextInput
              style={[styles.modalInput, styles.otpInput]}
              value={otpCode}
              onChangeText={setOtpCode}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="000000"
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setModalMode('none')}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleConfirmOtp}
              >
                <Text style={styles.modalSubmitText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL: ADD SAVED PLACE ================= */}
      <Modal visible={modalMode === 'addPlace'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Salvar Endereço</Text>
            <Text style={styles.modalLabel}>Rótulo:</Text>
            <View style={styles.labelsRow}>
              {['Casa', 'Trabalho', 'Favorito'].map((lbl) => (
                <TouchableOpacity
                  key={lbl}
                  style={[
                    styles.lblBadge,
                    placeLabel === lbl && styles.lblBadgeActive,
                  ]}
                  onPress={() => setPlaceLabel(lbl)}
                >
                  <Text
                    style={[
                      styles.lblText,
                      placeLabel === lbl && styles.lblTextActive,
                    ]}
                  >
                    {lbl}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.modalLabel}>Endereço Completo em Alagoas:</Text>
            <TextInput
              style={styles.modalInput}
              value={placeAddress}
              onChangeText={setPlaceAddress}
              placeholder="Ex: Praça São Francisco, 100 - Penedo / Piaçabuçu"
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setModalMode('none')}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleAddPlace}
              >
                <Text style={styles.modalSubmitText}>Salvar Endereço</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL: CHANGE PASSWORD ================= */}
      <Modal visible={modalMode === 'password'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Alterar Senha</Text>
            <Text style={styles.modalLabel}>Senha Atual:</Text>
            <TextInput
              style={styles.modalInput}
              value={currentPass}
              onChangeText={setCurrentPass}
              secureTextEntry
              placeholder="Digite a senha atual"
            />
            <Text style={styles.modalLabel}>Nova Senha:</Text>
            <TextInput
              style={styles.modalInput}
              value={newPass}
              onChangeText={setNewPass}
              secureTextEntry
              placeholder="Mínimo 6 caracteres"
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setModalMode('none')}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleChangePassword}
              >
                <Text style={styles.modalSubmitText}>Alterar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL: LEGAL (TERMS / PRIVACY) ================= */}
      <Modal
        visible={modalMode === 'terms' || modalMode === 'privacy'}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '80%' }]}>
            <Text style={styles.modalTitle}>{legalTitle}</Text>
            <ScrollView style={{ marginVertical: 12 }}>
              {legalContent.map((sec, idx) => (
                <View key={idx} style={{ marginBottom: 12 }}>
                  <Text style={{ fontWeight: '800', color: '#123D32', fontSize: 13 }}>
                    {sec.title}
                  </Text>
                  <Text style={{ color: '#475569', fontSize: 12, marginTop: 4, lineHeight: 18 }}>
                    {sec.content}
                  </Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.modalSubmitBtn, { alignSelf: 'stretch' }]}
              onPress={() => setModalMode('none')}
            >
              <Text style={styles.modalSubmitText}>Fechar</Text>
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
    backgroundColor: '#F8F9F6',
  },
  contentContainer: {
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#16A572',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: '#123D32',
  },
  email: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  phoneBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  phone: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  verifiedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  verifiedText: {
    color: '#166534',
    fontSize: 10,
    fontWeight: '800',
  },
  unverifiedBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  unverifiedText: {
    color: '#B45309',
    fontSize: 10,
    fontWeight: '800',
  },
  editProfileButton: {
    marginTop: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  editProfileText: {
    color: '#123D32',
    fontWeight: '700',
    fontSize: 13,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#123D32',
  },
  addPlaceButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
  },
  addPlaceText: {
    color: '#166534',
    fontWeight: '800',
    fontSize: 12,
  },
  emptyText: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  placeIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeDetails: {
    flex: 1,
  },
  placeLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  placeAddress: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  deletePlaceButton: {
    padding: 8,
  },
  deletePlaceText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
  },
  prefSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 12,
  },
  categoryPrefRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryPrefBadge: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#F8F9F6',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    gap: 4,
  },
  categoryPrefBadgeActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A572',
  },
  categoryPrefText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  categoryPrefTextActive: {
    color: '#166534',
    fontWeight: '800',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  menuIcon: {
    fontSize: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  menuChevron: {
    fontSize: 18,
    color: '#94A3B8',
    fontWeight: '700',
  },
  logoutButton: {
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    alignItems: 'center',
    marginTop: 8,
  },
  logoutText: {
    color: '#DC2626',
    fontWeight: '800',
    fontSize: 14,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#123D32',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginTop: 10,
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: '#F8F9F6',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1E293B',
  },
  otpInput: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 8,
    fontFamily: 'monospace',
  },
  otpDemoBox: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  otpDemoText: {
    color: '#B45309',
    fontSize: 12,
    fontWeight: '800',
  },
  labelsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  lblBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  lblBadgeActive: {
    backgroundColor: '#123D32',
  },
  lblText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  lblTextActive: {
    color: '#FFFFFF',
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  modalCancelText: {
    color: '#64748B',
    fontWeight: '700',
    fontSize: 13,
  },
  modalSubmitBtn: {
    backgroundColor: '#16A572',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});
