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
import { useDriverStore } from '../../stores/driverStore';

export default function DriverLoginScreen({ navigation }: any) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('carlos.motorista@mobility.com');
  const [phone, setPhone] = useState('82988887777');
  const [cnh, setCnh] = useState('AL-1234567890');
  const [password, setPassword] = useState('Senha123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, register } = useDriverStore();

  const handleAction = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isRegistering) {
        if (!name || !email || !password || !cnh) {
          Alert.alert('Atenção', 'Preencha todos os campos cadastrais.');
          setLoading(false);
          return;
        }
        await register(name, email, password, phone, cnh);
      } else {
        await login(email, password);
      }
    } catch (e: any) {
      setError(e.message || 'Falha ao autenticar motorista');
    } finally {
      setLoading(false);
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
          <Text style={styles.logo}>SIMBORA MOTORISTA</Text>
          <Text style={styles.subtitle}>Cockpit Profissional • Alagoas</Text>
          <Text style={styles.corridor}>Atendimento em Penedo, Piaçabuçu e Litoral Sul</Text>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.error}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Text style={styles.formTitle}>
            {isRegistering ? 'Cadastro de Motorista Parceiro' : 'Acesso ao Cockpit'}
          </Text>

          {isRegistering && (
            <>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ex: Carlos Alberto da Silva"
                placeholderTextColor="#64748B"
              />

              <Text style={styles.label}>Telefone Celular (WhatsApp)</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="82988887777"
                placeholderTextColor="#64748B"
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Número da CNH (com EAR)</Text>
              <TextInput
                style={styles.input}
                value={cnh}
                onChangeText={setCnh}
                placeholder="Ex: AL-0012345678"
                placeholderTextColor="#64748B"
              />
            </>
          )}

          <Text style={styles.label}>Email Profissional</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="carlos@exemplo.com"
            placeholderTextColor="#64748B"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Digite sua senha"
            placeholderTextColor="#64748B"
          />

          <TouchableOpacity
            style={styles.btn}
            onPress={handleAction}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#123D32" />
            ) : (
              <Text style={styles.btnText}>
                {isRegistering ? 'CADASTRAR E ENVIAR CNH' : 'ACESSAR COCKPIT'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={() => {
              setError(null);
              setIsRegistering(!isRegistering);
            }}
          >
            <Text style={styles.toggleText}>
              {isRegistering
                ? 'Já é parceiro cadastrado? Faça Login'
                : 'Quer ser motorista parceiro? Cadastre-se aqui'}
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
    backgroundColor: '#0A0F0D',
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
    borderWidth: 2,
    borderColor: '#16A572',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  brandLetter: {
    color: '#FFCC45',
    fontWeight: '900',
    fontSize: 28,
  },
  logo: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#16A572',
    fontWeight: '700',
    marginTop: 4,
  },
  corridor: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#2A1215',
    borderWidth: 1,
    borderColor: '#7F1D1D',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  error: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#121D18',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1E382B',
  },
  formTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
    marginBottom: 14,
    textAlign: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#0E1713',
    borderWidth: 1,
    borderColor: '#1E382B',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 13,
    color: '#F8F9F6',
  },
  btn: {
    backgroundColor: '#FFCC45',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  btnText: {
    color: '#123D32',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  toggleBtn: {
    alignItems: 'center',
    marginTop: 16,
  },
  toggleText: {
    color: '#16A572',
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
  },
});
