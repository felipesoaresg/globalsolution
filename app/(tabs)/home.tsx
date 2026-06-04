import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth } from '../../firebaseConfig';
import { useApi } from '../../hook/useApi';
import type { Alerta, Clima, Preferencias, Score } from '../../types/useTypes';

export default function HomeScreen() {
  const { scoreHoje, climaAtual, obterAlertas, obterPreferencias } = useApi();
  const nomeUsuario = auth.currentUser?.displayName ?? 'Usuário';

  const { data: score, refetch: refetchScore } = useQuery<Score>({
    queryKey: ['score'],
    queryFn: () => scoreHoje() as Promise<Score>,
  });

  const { data: clima, refetch: refetchClima } = useQuery<Clima>({
    queryKey: ['clima'],
    queryFn: () => climaAtual() as Promise<Clima>,
  });

  const { data: alertas = [], refetch: refetchAlertas } = useQuery<Alerta[]>({
    queryKey: ['alertas'],
    queryFn: () => obterAlertas() as Promise<Alerta[]>,
  });

  const { data: preferencias, refetch: refetchPreferencias } = useQuery<Preferencias>({
    queryKey: ['preferencias'],
    queryFn: () => obterPreferencias() as Promise<Preferencias>,
    retry: false,
  });

  const { isLoading } = useQuery({
    queryKey: ['home-all'],
    queryFn: async () => {
      await Promise.all([refetchScore(), refetchClima(), refetchAlertas(), refetchPreferencias()]);
      return true;
    },
    enabled: false,
  });

  useFocusEffect(
    useCallback(() => {
      refetchScore();
      refetchClima();
      refetchAlertas();
      refetchPreferencias();
    }, [])
  );

  const mostrarUV       = preferencias ? preferencias.notify_uv      : true;
  const mostrarChuva    = preferencias ? preferencias.notify_rain     : true;
  const mostrarTransito = preferencias ? preferencias.notify_transit  : true;
  const mostrarFlood    = preferencias ? preferencias.notify_flood    : true;

  const scoreColor = score?.level === 'great' ? '#3DD68C'
    : score?.level === 'ok' ? '#F5A623'
    : score?.level === 'bad' ? '#F5A623'
    : '#E25C5C';

  const alertasFiltrados = alertas.filter((a) => {
    if (a.type === 'flood'   && !mostrarFlood)    return false;
    if (a.type === 'uv'      && !mostrarUV)        return false;
    if (a.type === 'rain'    && !mostrarChuva)     return false;
    if ((a.type === 'transit' || a.type === 'traffic') && !mostrarTransito) return false;
    return true;
  });

  const carregando = !score && !clima;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {nomeUsuario}</Text>
          <Text style={styles.city}>São Paulo</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('../perfil' as any)} style={styles.userBtn}>
          <Ionicons name="person-circle-outline" size={32} color="#3DD68C" />
        </TouchableOpacity>
      </View>

      {carregando ? (
        <View style={styles.loading}>
          <ActivityIndicator color="#3DD68C" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.scoreWrap}>
            <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
              <Text style={[styles.scoreNum, { color: scoreColor }]}>{score?.score ?? '--'}</Text>
              <Text style={styles.scoreLv}>{score?.level ?? ''}</Text>
            </View>
            <Text style={styles.scoreLabel}>Score do dia</Text>
            {score?.summary ? <Text style={styles.scoreSub}>{score.summary}</Text> : null}
          </View>

          <View style={styles.grid}>
            <View style={styles.miniCard}>
              <Ionicons name="thermometer-outline" size={18} color="#F5A623" />
              <Text style={styles.miniVal}>{clima?.temp_c ?? '--'}°C</Text>
              <Text style={styles.miniLabel}>Temperatura</Text>
            </View>
            {mostrarChuva && (
              <View style={styles.miniCard}>
                <Ionicons name="rainy-outline" size={18} color="#378ADD" />
                <Text style={styles.miniVal}>{clima?.rain_mm ?? '--'}mm</Text>
                <Text style={styles.miniLabel}>Chuva</Text>
              </View>
            )}
            {mostrarUV && (
              <View style={styles.miniCard}>
                <Ionicons name="sunny-outline" size={18} color="#E25C5C" />
                <Text style={styles.miniVal}>UV {clima?.uv_index ?? '--'}</Text>
                <Text style={styles.miniLabel}>Índice UV</Text>
              </View>
            )}
            <View style={styles.miniCard}>
              <Ionicons name="water-outline" size={18} color="#378ADD" />
              <Text style={styles.miniVal}>{clima?.humidity ?? '--'}%</Text>
              <Text style={styles.miniLabel}>Umidade</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Alertas ativos</Text>
              {alertasFiltrados.length > 0 && (
                <TouchableOpacity onPress={() => router.push('../alertas' as any)}>
                  <Text style={styles.verTodos}>Ver todos</Text>
                </TouchableOpacity>
              )}
            </View>
            {alertasFiltrados.length === 0 ? (
              <Text style={styles.empty}>Nenhum alerta no momento</Text>
            ) : (
              alertasFiltrados.slice(0, 3).map((a) => (
                <TouchableOpacity
                  key={a.id}
                  style={styles.alertRow}
                  onPress={() => router.push('../alertas' as any)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.dot, {
                    backgroundColor: a.severity === 'critical' || a.severity === 'high'
                      ? '#E25C5C'
                      : a.severity === 'medium' ? '#F5A623'
                      : '#3DD68C'
                  }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.alertTitle}>{a.title}</Text>
                    <Text style={styles.alertSub}>{a.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={14} color="#555" />
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 48 },
  greeting: { fontSize: 18, fontWeight: '600', color: '#fff' },
  city: { fontSize: 13, color: '#666', marginTop: 2 },
  userBtn: { padding: 4 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scoreWrap: { alignItems: 'center', marginBottom: 20 },
  scoreCircle: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  scoreNum: { fontSize: 28, fontWeight: '600' },
  scoreLv: { fontSize: 10, color: '#666' },
  scoreLabel: { fontSize: 12, color: '#888' },
  scoreSub: { fontSize: 11, color: '#555', marginTop: 4, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  miniCard: { flex: 1, minWidth: '45%', backgroundColor: '#131920', borderRadius: 10, padding: 12, borderWidth: 0.5, borderColor: '#1e2530', gap: 4 },
  miniVal: { fontSize: 16, fontWeight: '500', color: '#fff' },
  miniLabel: { fontSize: 10, color: '#666' },
  card: { backgroundColor: '#131920', borderRadius: 10, padding: 12, borderWidth: 0.5, borderColor: '#1e2530', marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 11, color: '#888' },
  verTodos: { fontSize: 11, color: '#3DD68C' },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: '#1a2030' },
  dot: { width: 6, height: 6, borderRadius: 3, flexShrink: 0 },
  alertTitle: { fontSize: 12, color: '#ddd', fontWeight: '500' },
  alertSub: { fontSize: 10, color: '#555', marginTop: 2 },
  empty: { fontSize: 12, color: '#555', textAlign: 'center', paddingVertical: 8 },
});