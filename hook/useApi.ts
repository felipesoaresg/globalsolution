import { useCallback } from 'react';
import { auth } from '../firebaseConfig';
import {
  analisarRota,
  atualizarPreferencias,
  buscarClimaAtual,
  buscarImpactosTransporte,
  buscarPreferencias,
  buscarScoreHoje,
  buscarZonasAlagamento,
  criarPreferencias,
  criarRota,
  deletarPreferencias,
  deletarRota,
  editarRota,
  listarAlertas,
  listarRotas,
  registrarUsuarioNaApi,
} from '../services/api';

type PreferenciasData = {
  transit_lines: string;
  neighborhoods: string;
  notify_rain: boolean;
  notify_uv: boolean;
  notify_transit: boolean;
  notify_flood: boolean;
};

type CriarRotaData = {
  nome: string;
  origem: string;
  destino: string;
  horario_saida: string;
  linha_metro?: string;
};

type EditarRotaData = {
  nome: string;
  origem: string;
  destino: string;
  horario_saida: string;
  linha_metro?: string;
};

export function useApi() {
  const getUser = () => {
    const user = auth.currentUser;

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    return user;
  };

  const loginApi = useCallback(async () => {
    return await registrarUsuarioNaApi(getUser());
  }, []);

  const scoreHoje = useCallback(async () => {
    return await buscarScoreHoje(getUser());
  }, []);

  const obterAlertas = useCallback(async () => {
    return await listarAlertas(getUser());
  }, []);

  const climaAtual = useCallback(async () => {
    return await buscarClimaAtual(getUser());
  }, []);

  const impactosTransporte = useCallback(async () => {
    return await buscarImpactosTransporte(getUser());
  }, []);

  const zonasAlagamento = useCallback(async () => {
    return await buscarZonasAlagamento(getUser());
  }, []);

  const obterPreferencias = useCallback(async () => {
    return await buscarPreferencias(getUser());
  }, []);

  const salvarPreferencias = useCallback(async (dados: PreferenciasData) => {
    return await criarPreferencias(getUser(), dados as any);
  }, []);

  const editarPreferencias = useCallback(async (dados: PreferenciasData) => {
    return await atualizarPreferencias(getUser(), dados as any);
  }, []);

  const removerPreferencias = useCallback(async () => {
    return await deletarPreferencias(getUser());
  }, []);

  const obterRotas = useCallback(async () => {
    return await listarRotas(getUser());
  }, []);

  const novaRota = useCallback(async (dados: CriarRotaData) => {
    return await criarRota(getUser(), dados as any);
  }, []);

  const atualizarRota = useCallback(async (id: string, dados: EditarRotaData) => {
    return await editarRota(getUser(), id, dados as any);
  }, []);

  const removerRota = useCallback(async (id: string) => {
    return await deletarRota(getUser(), id);
  }, []);

  const obterAnaliseRota = useCallback(async (id: string) => {
    return await analisarRota(getUser(), id);
  }, []);

  return {
    loginApi,
    scoreHoje,
    obterAlertas,
    climaAtual,
    impactosTransporte,
    zonasAlagamento,
    obterPreferencias,
    salvarPreferencias,
    editarPreferencias,
    removerPreferencias,
    obterRotas,
    novaRota,
    atualizarRota,
    removerRota,
    obterAnaliseRota,
  };
}