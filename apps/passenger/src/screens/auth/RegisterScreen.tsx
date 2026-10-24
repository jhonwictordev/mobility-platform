import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuthStore } from '../../stores/authStore';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { register, isLoading, error, clearError } = useAuthStore();

  const handleRegister = async () => {
    if (!name || !email || !password || !phone) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }
    if (!termsAccepted) {
      Alert.alert('Termos Obrigatórios', 'Você deve aceitar os Termos de Uso e Política de Privacidade do SIMBORA para continuar.');
      return;
    }
    try {
      await register(name, email, password, phone);
    } catch {
      // Error handled in store
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandLetter}>S</Text>
          </View>
          <Text style={styles.title}>Criar Conta SIMBORA</Text>
          <Text style={styles.subtitle}>
            Conectando você às melhores rotas de Alagoas (Penedo ⇄ Piaçabuçu)
          </Text>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Clara Maria Ribeiro"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={(v) => {
              clearError();
              setName(v);
            }}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor="#94A3B8"
            value={email}
            onChangeText={(v) => {
              clearError();
              setEmail(v);
            }}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Telefone Celular (DDD + Número)</Text>
          <TextInput
            style={styles.input}
            placeholder="82999998888"
            placeholderTextColor="#94A3B8"
            value={phone}
            onChangeText={(v) => {
              clearError();
              setPhone(v);
            }}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Senha de Acesso</Text>
          <TextInput
            style={styles.input}
            placeholder="Crie uma senha forte (mínimo 6 caracteres)"
            placeholderTextColor="#94A3B8"
            value={password}
            onChangeText={(v) => {
              clearError();
              setPassword(v);
            }}
            secureTextEntry
          />

          {/* Terms Checkbox */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setTermsAccepted(!termsAccepted)}
          >
            <View style={[styles.checkbox, termsAccepted && styles.checkboxActive]}>
              {termsAccepted && <Text style={styles.checkboxCheck}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              Li e concordo com os <Text style={styles.termsBold}>Termos de Uso</Text> e a{' '}
              <Text style={styles.termsBold}>Política de Privacidade (LGPD)</Text> do SIMBORA.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#123D32" />
            ) : (
              <Text style={styles.buttonText}>CRIAR CONTA GRÁTIS</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.linkText}>
              Já possui conta? <Text style={styles.linkBold}>Faça login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9F6',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  brandBadge: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#123D32',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#16A572',
  },
  brandLetter: {
    color: '#FFCC45',
    fontSize: 28,
    fontWeight: '900',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#123D32',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
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
    marginTop: 12,
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#16A572',
    borderColor: '#16A572',
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  termsText: {
    flex: 1,
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  termsBold: {
    color: '#16A572',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#FFCC45',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
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
});
