import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import { useAuthStore } from '../../stores/authStore';

export default function LoginScreen({ navigation }: any) {
  const [identifier, setIdentifier] = useState('mariana@example.com');
  const [password, setPassword] = useState('Senha123!');
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetTokenInfo, setResetTokenInfo] = useState<string | null>(null);

  const { login, forgotPassword, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Atenção', 'Informe seu email ou telefone e sua senha.');
      return;
    }
    try {
      await login(identifier, password);
    } catch {
      // Error handled by store
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      Alert.alert('Atenção', 'Digite o email cadastrado.');
      return;
    }
    try {
      const res = await forgotPassword(forgotEmail);
      if (res.resetToken) {
        setResetTokenInfo(res.resetToken);
      }
      Alert.alert('Sucesso', res.message || 'Instruções enviadas com sucesso.');
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* SIMBORA Brand Header */}
        <View style={styles.header}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandLetter}>S</Text>
          </View>
          <Text style={styles.logo}>SIMBORA</Text>
          <Text style={styles.tagline}>Pediu. Chegou. Simbora!</Text>
          <Text style={styles.subtitle}>Mobilidade Urbana e Intermunicipal em Alagoas</Text>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Text style={styles.label}>Email ou Telefone</Text>
          <TextInput
            style={styles.input}
            placeholder="mariana@example.com ou 82999998888"
            placeholderTextColor="#94A3B8"
            value={identifier}
            onChangeText={(v) => {
              clearError();
              setIdentifier(v);
            }}
            autoCapitalize="none"
          />

          <View style={styles.passwordHeaderRow}>
            <Text style={styles.label}>Senha</Text>
            <TouchableOpacity onPress={() => setForgotModal(true)}>
              <Text style={styles.forgotText}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#94A3B8"
            value={password}
            onChangeText={(v) => {
              clearError();
              setPassword(v);
            }}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#123D32" />
            ) : (
              <Text style={styles.buttonText}>ENTRAR NO SIMBORA</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.linkText}>
              Não tem uma conta? <Text style={styles.linkBold}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Forgot Password Modal */}
      <Modal visible={forgotModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Recuperar Senha</Text>
            <Text style={styles.modalSubtitle}>
              Digite o seu email para receber o código ou link de redefinição de senha:
            </Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              value={forgotEmail}
              onChangeText={setForgotEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {resetTokenInfo && (
              <View style={styles.demoTokenBox}>
                <Text style={styles.demoTokenText}>Token de Teste: {resetTokenInfo}</Text>
              </View>
            )}
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setForgotModal(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleForgotPassword}
              >
                <Text style={styles.submitText}>Enviar Instruções</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9F6',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  brandBadge: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#123D32',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#16A572',
  },
  brandLetter: {
    color: '#FFCC45',
    fontSize: 32,
    fontWeight: '900',
  },
  logo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#123D32',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16A572',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#123D32',
    marginBottom: 6,
  },
  passwordHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 6,
  },
  forgotText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A572',
  },
  input: {
    backgroundColor: '#F8F9F6',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 13,
    color: '#1E293B',
  },
  button: {
    backgroundColor: '#FFCC45',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#FFCC45',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#123D32',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: {
    color: '#64748B',
    fontSize: 13,
  },
  linkBold: {
    color: '#16A572',
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
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
  demoTokenBox: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 10,
    marginTop: 10,
  },
  demoTokenText: {
    color: '#B45309',
    fontSize: 11,
    fontWeight: '700',
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cancelText: {
    color: '#64748B',
    fontWeight: '700',
    fontSize: 13,
  },
  submitBtn: {
    backgroundColor: '#123D32',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  submitText: {
    color: '#FFCC45',
    fontWeight: '800',
    fontSize: 13,
  },
});
