import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BackButton from '../../components/Backbutton';
import { useApi } from '../../hook/useApi';
import type { Preferencias, PreferenciasData } from '../../types/useTypes';

const LINHAS = ['L1','L2','L3','L4','L5','L7','L8','L9','L10','L11','L12','L13'];

export default function PreferenciasScreen() {
  const { obterPreferencias, salvarPreferencias, editarPreferencias } = useApi();
  const queryClient = useQueryClient();

  const [existe, setExiste] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [notifyRain, setNotifyRain] = useState(true);
  const [notifyUv, setNotifyUv] = useState(true);
  const [notifyTransit, setNotifyTransit] = useState(true);
  const [notifyFlood, setNotifyFlood] = useState(true);
  const [linhasSelecionadas, setLinhasSelecionadas] = useState<string[]>([]);

  useEffect(() => {
    async function carregar() {
      try {
        const data = await obterPreferencias() as Preferencias;
        setExiste(true);
        setNotifyRain(data.notify_rain);
        setNotifyUv(data.notify_uv);
        setNotifyTransit(data.notify_transit);
        setNotifyFlood(data.notify_flood);
        setLinhasSelecionadas(JSON.parse(data.transit_lines || '[]'));
      } catch {
        setExiste(false);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  const toggleLinha = (l: string) => {
    setLinhasSelecionadas((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
    );
  };

  const handleSalvar = async () => {
    setSalvando(true);
    const dados: PreferenciasData = {
      transit_lines: JSON.stringify(linhasSelecionadas),
      neighborhoods: '[]',
      notify_rain: notifyRain,
      notify_uv: notifyUv,
      notify_transit: notifyTransit,
      notify_flood: notifyFlood,
    };
    try {
      if (existe) {
        await editarPreferencias(dados);
      } else {
        await salvarPreferencias(dados);
        setExiste(true);
      }
      queryClient.invalidateQueries({ queryKey: ['preferencias'] });
      Alert.alert('Sucesso', 'Preferências salvas!');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Preferências</Text>
        <View style={{ width: 30 }} />
      </View>

      {carregando ? (
        <View style={styles.loading}><ActivityIndicator color="#3DD68C" /></View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notificações</Text>
            {([
              ['Chuva', notifyRain, setNotifyRain],
              ['UV alto', notifyUv, setNotifyUv],
              ['Transporte', notifyTransit, setNotifyTransit],
              ['Alagamento', notifyFlood, setNotifyFlood],
            ] as [string, boolean, (v: boolean) => void][]).map(([label, val, setter]) => (
              <View key={label} style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>{label}</Text>
                <Switch
                  value={val}
                  onValueChange={setter}
                  trackColor={{ true: '#3DD68C', false: '#1e2530' }}
                  thumbColor="#fff"
                />
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Linhas favoritas</Text>
            <View style={styles.linhasGrid}>
              {LINHAS.map((l) => {
                const on = linhasSelecionadas.includes(l);
                return (
                  <TouchableOpacity
                    key={l}
                    style={[styles.linhaBtn, on && styles.linhaBtnAtivo]}
                    onPress={() => toggleLinha(l)}
                  >
                    <Text style={[styles.linhaBtnText, on && styles.linhaBtnTextAtivo]}>{l}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.btnSalvar, salvando && styles.btnDesabilitado]}
            onPress={handleSalvar}
            disabled={salvando}
          >
            {salvando
              ? <ActivityIndicator color="#0a2a1a" />
              : <Text style={styles.btnSalvarText}>Salvar preferências</Text>
            }
          </TouchableOpacity>
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
  card: { backgroundColor: '#131920', borderRadius: 10, padding: 12, borderWidth: 0.5, borderColor: '#1e2530', marginBottom: 12 },
  cardTitle: { fontSize: 11, color: '#888', marginBottom: 10 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: '#1a2030' },
  toggleLabel: { fontSize: 13, color: '#ddd' },
  linhasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  linhaBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 0.5, borderColor: '#1e2530', backgroundColor: '#0d1117' },
  linhaBtnAtivo: { backgroundColor: 'rgba(61,214,140,0.15)', borderColor: '#3DD68C' },
  linhaBtnText: { fontSize: 12, color: '#555' },
  linhaBtnTextAtivo: { color: '#3DD68C' },
  btnSalvar: { backgroundColor: '#3DD68C', borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 32 },
  btnDesabilitado: { backgroundColor: '#2a7a56' },
  btnSalvarText: { color: '#0a2a1a', fontSize: 15, fontWeight: '600' },
});