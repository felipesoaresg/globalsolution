import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import BackButton from '../components/Backbutton';
import { useApi } from '../hook/useApi';
import type { Alerta, AlertaSeveridade } from '../types/useTypes';

export default function AlertasScreen() {
  const { obterAlertas } = useApi();

  const { data: alertas = [], isLoading } = useQuery<Alerta[]>({
    queryKey: ['alertas'],
    queryFn: () => obterAlertas() as Promise<Alerta[]>,
  });

  const severityColor = (s: AlertaSeveridade) =>
    s === 'critical' || s === 'high' ? '#E25C5C'
    : s === 'medium' ? '#F5A623'
    : '#3DD68C';

  const severityLabel = (s: AlertaSeveridade) =>
    s === 'critical' ? 'Crítico'
    : s === 'high' ? 'Alto'
    : s === 'medium' ? 'Médio'
    : 'Baixo';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Alertas</Text>
        <View style={{ width: 30 }} />
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color="#3DD68C" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {alertas.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Nenhum alerta ativo</Text>
            </View>
          ) : (
            alertas.map((a) => (
              <View key={a.id} style={styles.alertCard}>
                <View style={styles.alertTop}>
                  <View style={[styles.dot, { backgroundColor: severityColor(a.severity) }]} />
                  <Text style={styles.alertTitle}>{a.title}</Text>
                  <View style={[styles.badge, { backgroundColor: `${severityColor(a.severity)}22` }]}>
                    <Text style={[styles.badgeText, { color: severityColor(a.severity) }]}>
                      {severityLabel(a.severity)}
                    </Text>
                  </View>
                </View>
                {a.description ? <Text style={styles.alertDesc}>{a.description}</Text> : null}
                <Text style={styles.alertTime}>
                  {a.starts_at}{a.ends_at ? ` → ${a.ends_at}` : ''}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, marginTop: 48 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  alertCard: { backgroundColor: '#131920', borderRadius: 10, padding: 12, borderWidth: 0.5, borderColor: '#1e2530', marginBottom: 8 },
  alertTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, flexShrink: 0 },
  alertTitle: { flex: 1, fontSize: 12, color: '#ddd', fontWeight: '500' },
  badge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  badgeText: { fontSize: 10, fontWeight: '500' },
  alertDesc: { fontSize: 11, color: '#666', marginBottom: 6 },
  alertTime: { fontSize: 10, color: '#444' },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 14, color: '#555' },
});