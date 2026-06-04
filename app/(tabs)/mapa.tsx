import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import BackButton from '../../components/Backbutton';
import { useApi } from '../../hook/useApi';
import type { Impacto, RiscoNivel, TransitoStatus, ZonaAlagamento } from '../../types/useTypes';

export default function MapaScreen() {
  const { zonasAlagamento, impactosTransporte } = useApi();

  const { data: zonas = [], isLoading: loadingZonas } = useQuery<ZonaAlagamento[]>({
    queryKey: ['zonas-alagamento'],
    queryFn: () => zonasAlagamento() as Promise<ZonaAlagamento[]>,
  });

  const { data: impactos = [], isLoading: loadingImpactos } = useQuery<Impacto[]>({
    queryKey: ['impactos'],
    queryFn: () => impactosTransporte() as Promise<Impacto[]>,
  });

  const isLoading = loadingZonas || loadingImpactos;

  const riskColor = (level: RiscoNivel) =>
    level === 'high' ? '#E25C5C' : level === 'medium' ? '#F5A623' : '#3DD68C';

  const statusColor = (status: TransitoStatus) =>
    status === 'disrupted' ? '#E25C5C' : status === 'slow' ? '#F5A623' : '#3DD68C';

  const statusLabel = (status: TransitoStatus) =>
    status === 'disrupted' ? 'Evitar' : status === 'slow' ? 'Lento' : 'Ok';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Mapa de impacto</Text>
        <View style={{ width: 30 }} />
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color="#3DD68C" />
        </View>
      ) : (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: -23.5505,
              longitude: -46.6333,
              latitudeDelta: 0.15,
              longitudeDelta: 0.15,
            }}
            customMapStyle={mapStyle}
          >
            {zonas.map((zona) => (
              <View key={zona.id}>
                <Circle
                  center={{ latitude: zona.lat, longitude: zona.lng }}
                  radius={zona.radius_m}
                  fillColor={`${riskColor(zona.risk_level)}33`}
                  strokeColor={riskColor(zona.risk_level)}
                  strokeWidth={1}
                />
                <Marker
                  coordinate={{ latitude: zona.lat, longitude: zona.lng }}
                  title={zona.name}
                  description={`Risco: ${zona.risk_level}`}
                  pinColor={riskColor(zona.risk_level)}
                />
              </View>
            ))}
          </MapView>

          <View style={styles.legend}>
            {[['#E25C5C', 'Alagamento'], ['#F5A623', 'Lentidão'], ['#3DD68C', 'Normal']].map(([cor, label]) => (
              <View key={label} style={styles.legItem}>
                <View style={[styles.legDot, { backgroundColor: cor }]} />
                <Text style={styles.legText}>{label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Linhas de metrô</Text>
            {impactos.length === 0 ? (
              <Text style={styles.empty}>Nenhum impacto registrado</Text>
            ) : (
              impactos.map((i, idx) => (
                <View key={idx} style={styles.routeRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.routeName}>{i.linha}</Text>
                    <Text style={styles.routeSub}>
                      {i.atraso_min > 0 ? `Atraso: ${i.atraso_min} min` : 'Operação normal'}
                    </Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: `${statusColor(i.status)}22` }]}>
                    <Text style={[styles.badgeText, { color: statusColor(i.status) }]}>
                      {statusLabel(i.status)}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </>
      )}
    </View>
  );
}

const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1a2535' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#243040' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1a2535' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d1117' }] },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 48 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { flex: 1 },
  legend: { flexDirection: 'row', gap: 16, padding: 12, backgroundColor: '#0d1117' },
  legItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legDot: { width: 8, height: 8, borderRadius: 4 },
  legText: { fontSize: 11, color: '#777' },
  card: { backgroundColor: '#131920', margin: 12, borderRadius: 10, padding: 12, borderWidth: 0.5, borderColor: '#1e2530' },
  cardTitle: { fontSize: 11, color: '#888', marginBottom: 8 },
  routeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: '#1a2030' },
  routeName: { fontSize: 12, color: '#ddd', fontWeight: '500' },
  routeSub: { fontSize: 10, color: '#555', marginTop: 2 },
  badge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  badgeText: { fontSize: 10, fontWeight: '500' },
  empty: { fontSize: 12, color: '#555', textAlign: 'center', paddingVertical: 8 },
});