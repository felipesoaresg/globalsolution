import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import BackButton from '../components/Backbutton';
import { auth } from '../firebaseConfig';

export default function PerfilScreen() {
  const user = auth.currentUser;
  const [saindo, setSaindo] = useState(false);

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair', style: 'destructive',
        onPress: async () => {
          setSaindo(true);
          try {
            await signOut(auth);
            router.replace('/login');
          } catch {
            Alert.alert('Erro', 'Não foi possível sair.');
          } finally {
            setSaindo(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.displayName?.charAt(0).toUpperCase() ?? 'U'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.displayName ?? 'Usuário'}</Text>
        <Text style={styles.email}>{user?.email ?? ''}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={18} color="#555" />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoLabel}>Nome</Text>
            <Text style={styles.infoValue}>{user?.displayName ?? '—'}</Text>
          </View>
        </View>
        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Ionicons name="mail-outline" size={18} color="#555" />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoLabel}>E-mail</Text>
            <Text style={styles.infoValue}>{user?.email ?? '—'}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.btnLogout, saindo && styles.btnDesabilitado]}
        onPress={handleLogout}
        disabled={saindo}
      >
        {saindo ? (
          <ActivityIndicator color="#E25C5C" />
        ) : (
          <>
            <Ionicons name="log-out-outline" size={18} color="#E25C5C" />
            <Text style={styles.btnLogoutText}>Sair da conta</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, marginTop: 48 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  avatarWrap: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#3DD68C', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 28, fontWeight: '600', color: '#0a2a1a' },
  name: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 4 },
  email: { fontSize: 13, color: '#666' },
  card: { backgroundColor: '#131920', borderRadius: 10, padding: 12, borderWidth: 0.5, borderColor: '#1e2530', marginBottom: 24 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#1a2030' },
  infoLabel: { fontSize: 10, color: '#555', marginBottom: 2 },
  infoValue: { fontSize: 14, color: '#ddd' },
  btnLogout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 10, padding: 14, borderWidth: 0.5, borderColor: 'rgba(226,92,92,0.3)' },
  btnDesabilitado: { opacity: 0.5 },
  btnLogoutText: { color: '#E25C5C', fontSize: 15, fontWeight: '500' },
});