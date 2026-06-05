import { Ionicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  ActivityIndicator, Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApi } from '../../hook/useApi';
import type { AnaliseNivel, AnaliseRota, CriarRotaData, EditarRotaData, Rota } from '../../types/useTypes';

const LINHAS = ['L1','L2','L3','L4','L5','L7','L8','L9','L10','L11','L12','L13'];

export default function RotasScreen() {
  const { obterRotas, novaRota, atualizarRota, removerRota, obterAnaliseRota } = useApi();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

  const [modalVisivel, setModalVisivel] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [editando, setEditando] = useState<Rota | null>(null);
  const [nome, setNome] = useState('');
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [horario, setHorario] = useState('');
  const [linha, setLinha] = useState('');

  const { data: rotas = [], isLoading } = useQuery<Rota[]>({
    queryKey: ['rotas'],
    queryFn: () => obterRotas() as Promise<Rota[]>,
  });

  const primeiraRotaId = rotas[0]?.id;

  const { data: analise } = useQuery<AnaliseRota>({
    queryKey: ['analise-rota', primeiraRotaId],
    queryFn: () => obterAnaliseRota(primeiraRotaId!) as Promise<AnaliseRota>,
    enabled: !!primeiraRotaId,
  });

  function abrirModal(rota?: Rota) {
    if (rota) {
      setEditando(rota);
      setNome(rota.nome);
      setOrigem(rota.origem);
      setDestino(rota.destino);
      setHorario(rota.horario_saida);
      setLinha(rota.linha_metro ?? '');
    } else {
      setEditando(null);
      setNome(''); setOrigem(''); setDestino(''); setHorario(''); setLinha('');
    }
    setModalVisivel(true);
  }

  async function handleSalvar() {
    if (!nome || !origem || !destino || !horario) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }
    setSalvando(true);
    try {
      const dados: CriarRotaData | EditarRotaData = {
        nome, origem, destino, horario_saida: horario, linha_metro: linha || undefined,
      };
      if (editando) {
        await atualizarRota(editando.id, dados as EditarRotaData);
      } else {
        await novaRota(dados as CriarRotaData);
      }
      setModalVisivel(false);
      queryClient.invalidateQueries({ queryKey: ['rotas'] });
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a rota.');
    } finally {
      setSalvando(false);
    }
  }

  async function handleDeletar(id: string) {
    Alert.alert('Remover rota', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover', style: 'destructive',
        onPress: async () => {
          try {
            await removerRota(id);
            queryClient.invalidateQueries({ queryKey: ['rotas'] });
          } catch {
            Alert.alert('Erro', 'Não foi possível remover.');
          }
        },
      },
    ]);
  }

  const nivelColor = (nivel: AnaliseNivel) =>
    nivel === 'critico' ? '#E25C5C' : nivel === 'atencao' ? '#F5A623' : '#3DD68C';

  return (
    <View style={styles.container}>
      <View style={[styles.header, { marginTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Rotas favoritas</Text>
        <TouchableOpacity style={styles.fab} onPress={() => abrirModal()}>
          <Ionicons name="add" size={20} color="#0a2a1a" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loading}><ActivityIndicator color="#3DD68C" /></View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {analise && (
            <View style={[styles.analiseCard, { borderColor: `${nivelColor(analise.nivel)}44` }]}>
              <Text style={[styles.analiseTitle, { color: nivelColor(analise.nivel) }]}>
                Recomendação
              </Text>
              <Text style={styles.analiseResumo}>{analise.resumo}</Text>
              {analise.recomendacoes.map((r, i) => (
                <Text key={i} style={styles.analiseItem}>• {r}</Text>
              ))}
            </View>
          )}

          {rotas.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="git-branch-outline" size={40} color="#333" />
              <Text style={styles.emptyText}>Nenhuma rota cadastrada</Text>
              <Text style={styles.emptySub}>Toque em + para adicionar</Text>
            </View>
          ) : (
            rotas.map((rota) => (
              <View key={rota.id} style={styles.rotaCard}>
                <View style={styles.rotaTop}>
                  <Ionicons name="git-branch-outline" size={16} color="#3DD68C" />
                  <Text style={styles.rotaNome}>{rota.nome}</Text>
                </View>
                <Text style={styles.rotaDetalhe}>{rota.origem} → {rota.destino}</Text>
                <View style={styles.rotaBottom}>
                  <Text style={styles.rotaInfo}>
                    {rota.linha_metro ? `${rota.linha_metro} • ` : ''}{rota.horario_saida}
                  </Text>
                  <View style={styles.rotaAcoes}>
                    <TouchableOpacity onPress={() => abrirModal(rota)}>
                      <Ionicons name="pencil-outline" size={16} color="#555" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeletar(rota.id)}>
                      <Ionicons name="trash-outline" size={16} color="#E25C5C" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editando ? 'Editar rota' : 'Nova rota'}</Text>
              <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Nome da rota *</Text>
            <TextInput style={styles.input} placeholder="Ex: Casa → Trabalho" placeholderTextColor="#444" value={nome} onChangeText={setNome} />

            <Text style={styles.fieldLabel}>Origem *</Text>
            <TextInput style={styles.input} placeholder="Ex: Vila Mariana" placeholderTextColor="#444" value={origem} onChangeText={setOrigem} />

            <Text style={styles.fieldLabel}>Destino *</Text>
            <TextInput style={styles.input} placeholder="Ex: Paulista" placeholderTextColor="#444" value={destino} onChangeText={setDestino} />

            <Text style={styles.fieldLabel}>Horário de saída *</Text>
            <TextInput style={styles.input} placeholder="Ex: 08:00" placeholderTextColor="#444" value={horario} onChangeText={setHorario} />

            <Text style={styles.fieldLabel}>Linha de metrô</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {LINHAS.map((l) => (
                  <TouchableOpacity
                    key={l}
                    style={[styles.linhaBtn, linha === l && styles.linhaBtnAtivo]}
                    onPress={() => setLinha(linha === l ? '' : l)}
                  >
                    <Text style={[styles.linhaBtnText, linha === l && styles.linhaBtnTextAtivo]}>{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.btnSalvar, salvando && styles.btnDesabilitado]}
              onPress={handleSalvar}
              disabled={salvando}
            >
              {salvando
                ? <ActivityIndicator color="#0a2a1a" />
                : <Text style={styles.btnSalvarText}>{editando ? 'Salvar alterações' : 'Criar rota'}</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  fab: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#3DD68C', alignItems: 'center', justifyContent: 'center' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  analiseCard: { backgroundColor: 'rgba(61,214,140,0.06)', borderWidth: 0.5, borderRadius: 10, padding: 12, marginBottom: 12 },
  analiseTitle: { fontSize: 11, fontWeight: '500', marginBottom: 4 },
  analiseResumo: { fontSize: 13, color: '#ddd', fontWeight: '500', marginBottom: 6 },
  analiseItem: { fontSize: 11, color: '#888', marginTop: 2 },
  rotaCard: { backgroundColor: '#131920', borderRadius: 10, padding: 12, borderWidth: 0.5, borderColor: '#1e2530', marginBottom: 8 },
  rotaTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  rotaNome: { fontSize: 13, fontWeight: '500', color: '#fff' },
  rotaDetalhe: { fontSize: 12, color: '#888', marginBottom: 8 },
  rotaBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rotaInfo: { fontSize: 11, color: '#555' },
  rotaAcoes: { flexDirection: 'row', gap: 14 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyText: { fontSize: 14, color: '#555' },
  emptySub: { fontSize: 12, color: '#333' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#131920', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  modalTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  fieldLabel: { fontSize: 12, color: '#888', marginBottom: 6 },
  input: { backgroundColor: '#0d1117', borderWidth: 0.5, borderColor: '#1e2530', borderRadius: 8, padding: 10, color: '#fff', fontSize: 13, marginBottom: 12 },
  linhaBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 7, borderWidth: 0.5, borderColor: '#1e2530', backgroundColor: '#0d1117' },
  linhaBtnAtivo: { backgroundColor: 'rgba(61,214,140,0.15)', borderColor: '#3DD68C' },
  linhaBtnText: { fontSize: 11, color: '#555' },
  linhaBtnTextAtivo: { color: '#3DD68C' },
  btnSalvar: { backgroundColor: '#3DD68C', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 4 },
  btnDesabilitado: { backgroundColor: '#2a7a56' },
  btnSalvarText: { color: '#0a2a1a', fontSize: 15, fontWeight: '600' },
});