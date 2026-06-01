import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
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

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleCadastro = async () => {
    setErro('');

    if (!nome || !email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }

    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setCarregando(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);

      await updateProfile(userCredential.user, { displayName: nome });

      const token = await userCredential.user.getIdToken(true);

      let response;
      try {
        response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (networkError: any) {
        console.log('Erro de rede ao chamar API:', networkError);
        setErro('Não foi possível conectar à API. Verifique sua conexão.');
        return;
      }

      if (!response.ok) {
        const erroApi = await response.text();
        console.log('Status HTTP:', response.status);
        console.log('Corpo do erro:', erroApi);
        setErro(`Erro na API (${response.status}): ${erroApi}`);
        return;
      }

      const dados = await response.json();
      console.log('Resposta da API:', dados);

      // Mostra tela de sucesso e redireciona após 2s
      setSucesso(true);
      setTimeout(() => router.replace('/'), 2000);

    } catch (e: any) {
      console.log('ERRO COMPLETO:', JSON.stringify(e));
      switch (e.code) {
        case 'auth/email-already-in-use':
          setErro('Este e-mail já está em uso.');
          break;
        case 'auth/invalid-email':
          setErro('E-mail inválido.');
          break;
        case 'auth/weak-password':
          setErro('Senha muito fraca. Use no mínimo 6 caracteres.');
          break;
        case 'auth/network-request-failed':
          setErro('Sem conexão com a internet.');
          break;
        default:
          setErro(e?.message || 'Erro ao criar conta.');
          break;
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

        <Text style={styles.titulo}>Criar conta</Text>
        <Text style={styles.subtitulo}>Preencha os dados abaixo</Text>

        {erro ? (
          <View style={styles.erroBox}>
            <Ionicons name="alert-circle-outline" size={16} color="#E25C5C" style={{ marginRight: 6 }} />
            <Text style={styles.erroTexto}>{erro}</Text>
          </View>
        ) : null}

        {sucesso ? (
          <View style={styles.sucessoBox}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#3DD68C" style={{ marginRight: 6 }} />
            <Text style={styles.sucessoTexto}>Conta criada!</Text>
          </View>
        ) : null}

        <View style={styles.campo}>
          <Text style={styles.label}>Nome</Text>
          <View style={styles.inputRow}>
            <Ionicons name="person-outline" size={18} color="#444" style={styles.inputIcon} />
            <TextInput
              style={styles.inputSenha}
              placeholder="Seu nome"
              placeholderTextColor="#444"
              autoCapitalize="words"
              value={nome}
              onChangeText={(t) => { setNome(t); setErro(''); }}
            />
          </View>
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>E-mail</Text>
          <View style={[styles.inputRow, erro && erro.includes('e-mail') ? styles.inputErro : null]}>
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
          <View style={[styles.inputRow, erro && erro.includes('senha') ? styles.inputErro : null]}>
            <Ionicons name="lock-closed-outline" size={18} color="#444" style={styles.inputIcon} />
            <TextInput
              style={styles.inputSenha}
              placeholder="Mínimo 6 caracteres"
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
          onPress={handleCadastro}
          disabled={carregando}
        >
          {carregando
            ? <ActivityIndicator color="#0a2a1a" />
            : <Text style={styles.btnTexto}>Criar conta</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/')} style={{ marginTop: 20 }}>
          <Text style={styles.linkTexto}>
            Já tem conta? <Text style={styles.link}>Entrar</Text>
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

  sucessoBox: {
    backgroundColor: 'rgba(61,214,140,0.1)',
    borderWidth: 0.5,
    borderColor: 'rgba(61,214,140,0.4)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sucessoTexto: {
    color: '#3DD68C',
    fontSize: 13,
    flex: 1,
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
  linkTexto: {
    textAlign: 'center',
    color: '#555',
    fontSize: 13,
  },
  link: {
    color: '#3DD68C',
  },
});