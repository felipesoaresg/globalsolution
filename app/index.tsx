import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth } from '../firebaseConfig';

const API_URL = 'https://gs-ten-jade.vercel.app';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleLogin = async () => {
    setErro('');

    if (!email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }

    setCarregando(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const token = await userCredential.user.getIdToken();

      await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      router.replace('/(tabs)/home');

    } catch (e: any) {
      switch (e.code) {
        case 'auth/invalid-email':
          setErro('E-mail inválido.');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setErro('E-mail ou senha incorretos.');
          break;
        case 'auth/too-many-requests':
          setErro('Muitas tentativas. Tente novamente mais tarde.');
          break;
        default:
          setErro('Erro ao entrar. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.logo}>
          <View style={styles.logoIcon}>
            <MaterialCommunityIcons name="city" size={28} color="#0a2a1a" />
          </View>
          <Text style={styles.logoTitle}>Urban SP</Text>
        </View>

        <Text style={styles.titulo}>Entrar</Text>
        <Text style={styles.subtitulo}>Acesse sua conta</Text>

        {erro ? (
          <View style={styles.erroBox}>
            <Ionicons name="alert-circle-outline" size={16} color="#E25C5C" style={{ marginRight: 6 }} />
            <Text style={styles.erroTexto}>{erro}</Text>
          </View>
        ) : null}

        <View style={styles.campo}>
          <Text style={styles.label}>E-mail</Text>
          <View style={[styles.inputRow, erro ? styles.inputErro : null]}>
            <Ionicons name="mail-outline" size={18} color="#444" style={styles.inputIcon} />
            <TextInput
              style={styles.inputSenha}
              placeholder="seu@email.com"
              placeholderTextColor="#444"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(t) => { setEmail(t); setErro(''); }}
            />
          </View>
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Senha</Text>
          <View style={[styles.inputRow, erro ? styles.inputErro : null]}>
            <Ionicons name="lock-closed-outline" size={18} color="#444" style={styles.inputIcon} />
            <TextInput
              style={styles.inputSenha}
              placeholder="••••••••"
              placeholderTextColor="#444"
              secureTextEntry={!mostrarSenha}
              value={senha}
              onChangeText={(t) => { setSenha(t); setErro(''); }}
            />
            <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
              <Ionicons
                name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color="#444"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.btn, carregando && styles.btnDesabilitado]}
          onPress={handleLogin}
          disabled={carregando}
        >
          {carregando
            ? <ActivityIndicator color="#0a2a1a" />
            : <Text style={styles.btnTexto}>Entrar</Text>
          }
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.linha} />
          <Text style={styles.ou}>ou</Text>
          <View style={styles.linha} />
        </View>

        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.linkTexto}>
            Não tem conta? <Text style={styles.link}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#3DD68C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  titulo: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 13,
    color: '#666',
    marginBottom: 20,
  },
  erroBox: {
    backgroundColor: 'rgba(226,92,92,0.1)',
    borderWidth: 0.5,
    borderColor: 'rgba(226,92,92,0.4)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  erroTexto: {
    color: '#E25C5C',
    fontSize: 13,
    flex: 1,
  },
  campo: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
  },
  inputRow: {
    backgroundColor: '#131920',
    borderWidth: 0.5,
    borderColor: '#1e2a3a',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputIcon: {
    marginRight: 2,
  },
  inputSenha: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    paddingVertical: 12,
  },
  inputErro: {
    borderColor: 'rgba(226,92,92,0.5)',
  },
  btn: {
    backgroundColor: '#3DD68C',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  btnDesabilitado: {
    backgroundColor: '#2a7a56',
  },
  btnTexto: {
    color: '#0a2a1a',
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 10,
  },
  linha: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#1e2530',
  },
  ou: {
    color: '#444',
    fontSize: 12,
  },
  linkTexto: {
    textAlign: 'center',
    color: '#555',
    fontSize: 13,
  },
  link: {
    color: '#3DD68C',
  },
});