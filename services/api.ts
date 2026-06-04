import { User } from 'firebase/auth';

const API_URL = 'https://gs-ten-jade.vercel.app';

// ========================================
// TIPOS LOCAIS
// ========================================
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

// ========================================
// HELPERS
// ========================================
async function getAuthHeader(user: User): Promise<Record<string, string>> {
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const token = await user.getIdToken(true);

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

async function parseResponse(response: Response): Promise<any> {
  const text = await response.text();

  console.log('Status:', response.status);
  console.log('Resposta:', text);

  let data: any = {};

  try {
    data = JSON.parse(text);
  } catch {
    data = { error: text };
  }

  if (!response.ok) {
    throw new Error(data.error || 'Erro na API');
  }

  return data;
}

// ========================================
// AUTH
// ========================================
export async function registrarUsuarioNaApi(user: User): Promise<any> {
  const headers = await getAuthHeader(user);
  console.log('Chamando:', `${API_URL}/auth/login`);
  try {
    const response = await fetch(`${API_URL}/auth/login`, { method: 'POST', headers });
    return await parseResponse(response);
  } catch (error) {
    console.log('Erro registrarUsuarioNaApi:', error);
    throw error;
  }
}

// ========================================
// SCORE DO DIA
// ========================================
export async function buscarScoreHoje(user: User): Promise<any> {
  const headers = await getAuthHeader(user);
  console.log('Chamando:', `${API_URL}/score/hoje`);
  try {
    const response = await fetch(`${API_URL}/score/hoje`, { method: 'GET', headers });
    return await parseResponse(response);
  } catch (error) {
    console.log('Erro buscarScoreHoje:', error);
    throw error;
  }
}

// ========================================
// ALERTAS
// ========================================
export async function listarAlertas(user: User): Promise<any> {
  const headers = await getAuthHeader(user);
  console.log('Chamando:', `${API_URL}/alertas`);
  try {
    const response = await fetch(`${API_URL}/alertas`, { method: 'GET', headers });
    return await parseResponse(response);
  } catch (error) {
    console.log('Erro listarAlertas:', error);
    throw error;
  }
}

// ========================================
// CLIMA
// ========================================
export async function buscarClimaAtual(user: User): Promise<any> {
  const headers = await getAuthHeader(user);
  console.log('Chamando:', `${API_URL}/clima/atual`);
  try {
    const response = await fetch(`${API_URL}/clima/atual`, { method: 'GET', headers });
    return await parseResponse(response);
  } catch (error) {
    console.log('Erro buscarClimaAtual:', error);
    throw error;
  }
}

// ========================================
// TRANSPORTE
// ========================================
export async function buscarImpactosTransporte(user: User): Promise<any> {
  const headers = await getAuthHeader(user);
  console.log('Chamando:', `${API_URL}/transporte/impactos`);
  try {
    const response = await fetch(`${API_URL}/transporte/impactos`, { method: 'GET', headers });
    return await parseResponse(response);
  } catch (error) {
    console.log('Erro buscarImpactosTransporte:', error);
    throw error;
  }
}

// ========================================
// ZONAS DE ALAGAMENTO
// ========================================
export async function buscarZonasAlagamento(user: User): Promise<any> {
  const headers = await getAuthHeader(user);
  console.log('Chamando:', `${API_URL}/zonas-alagamento`);
  try {
    const response = await fetch(`${API_URL}/zonas-alagamento`, { method: 'GET', headers });
    return await parseResponse(response);
  } catch (error) {
    console.log('Erro buscarZonasAlagamento:', error);
    throw error;
  }
}

// ========================================
// PREFERENCIAS
// ========================================
export async function buscarPreferencias(user: User): Promise<any> {
  const headers = await getAuthHeader(user);
  console.log('Chamando:', `${API_URL}/preferencias`);
  try {
    const response = await fetch(`${API_URL}/preferencias`, { method: 'GET', headers });
    return await parseResponse(response);
  } catch (error) {
    console.log('Erro buscarPreferencias:', error);
    throw error;
  }
}

export async function criarPreferencias(user: User, dados: PreferenciasData): Promise<any> {
  const headers = await getAuthHeader(user);
  console.log('Chamando:', `${API_URL}/preferencias`);
  try {
    const response = await fetch(`${API_URL}/preferencias`, { method: 'POST', headers, body: JSON.stringify(dados) });
    return await parseResponse(response);
  } catch (error) {
    console.log('Erro criarPreferencias:', error);
    throw error;
  }
}

export async function atualizarPreferencias(user: User, dados: PreferenciasData): Promise<any> {
  const headers = await getAuthHeader(user);
  console.log('Chamando:', `${API_URL}/preferencias`);
  try {
    const response = await fetch(`${API_URL}/preferencias`, { method: 'PUT', headers, body: JSON.stringify(dados) });
    return await parseResponse(response);
  } catch (error) {
    console.log('Erro atualizarPreferencias:', error);
    throw error;
  }
}

export async function deletarPreferencias(user: User): Promise<any> {
  const headers = await getAuthHeader(user);
  console.log('Chamando:', `${API_URL}/preferencias`);
  try {
    const response = await fetch(`${API_URL}/preferencias`, { method: 'DELETE', headers });
    return await parseResponse(response);
  } catch (error) {
    console.log('Erro deletarPreferencias:', error);
    throw error;
  }
}

// ========================================
// ROTAS FAVORITAS
// ========================================
export async function listarRotas(user: User): Promise<any> {
  const headers = await getAuthHeader(user);
  console.log('Chamando:', `${API_URL}/rotas`);
  try {
    const response = await fetch(`${API_URL}/rotas`, { method: 'GET', headers });
    return await parseResponse(response);
  } catch (error) {
    console.log('Erro listarRotas:', error);
    throw error;
  }
}

export async function criarRota(user: User, dados: CriarRotaData): Promise<any> {
  const headers = await getAuthHeader(user);
  console.log('Chamando:', `${API_URL}/rotas`);
  try {
    const response = await fetch(`${API_URL}/rotas`, { method: 'POST', headers, body: JSON.stringify(dados) });
    return await parseResponse(response);
  } catch (error) {
    console.log('Erro criarRota:', error);
    throw error;
  }
}

export async function editarRota(user: User, id: string, dados: EditarRotaData): Promise<any> {
  const headers = await getAuthHeader(user);
  console.log('Chamando:', `${API_URL}/rotas/${id}`);
  try {
    const response = await fetch(`${API_URL}/rotas/${id}`, { method: 'PUT', headers, body: JSON.stringify(dados) });
    return await parseResponse(response);
  } catch (error) {
    console.log('Erro editarRota:', error);
    throw error;
  }
}

export async function deletarRota(user: User, id: string): Promise<any> {
  const headers = await getAuthHeader(user);
  console.log('Chamando:', `${API_URL}/rotas/${id}`);
  try {
    const response = await fetch(`${API_URL}/rotas/${id}`, { method: 'DELETE', headers });
    return await parseResponse(response);
  } catch (error) {
    console.log('Erro deletarRota:', error);
    throw error;
  }
}

export async function analisarRota(user: User, id: string): Promise<any> {
  const headers = await getAuthHeader(user);
  console.log('Chamando:', `${API_URL}/rotas/${id}/analise`);
  try {
    const response = await fetch(`${API_URL}/rotas/${id}/analise`, { method: 'GET', headers });
    return await parseResponse(response);
  } catch (error) {
    console.log('Erro analisarRota:', error);
    throw error;
  }
}