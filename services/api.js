const API_URL = 'https://gs-ten-jade.vercel.app';

// ========================================
// HELPERS
// ========================================
async function getAuthHeader(user) {
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const token = await user.getIdToken(true);

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

async function parseResponse(response) {
  const text = await response.text();

  console.log('Status:', response.status);
  console.log('Resposta:', text);

  let data = {};

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
export async function registrarUsuarioNaApi(user) {
  const headers = await getAuthHeader(user);

  console.log('Chamando:', `${API_URL}/auth/login`);

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers,
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro registrarUsuarioNaApi:', error);
    throw error;
  }
}

// ========================================
// SCORE DO DIA
// ========================================
export async function buscarScoreHoje(user) {
  const headers = await getAuthHeader(user);

  console.log('Chamando:', `${API_URL}/score/hoje`);

  try {
    const response = await fetch(`${API_URL}/score/hoje`, {
      method: 'GET',
      headers,
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro buscarScoreHoje:', error);
    throw error;
  }
}

// ========================================
// ALERTAS
// ========================================
export async function listarAlertas(user) {
  const headers = await getAuthHeader(user);

  console.log('Chamando:', `${API_URL}/alertas`);

  try {
    const response = await fetch(`${API_URL}/alertas`, {
      method: 'GET',
      headers,
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro listarAlertas:', error);
    throw error;
  }
}

// ========================================
// CLIMA
// ========================================
export async function buscarClimaAtual(user) {
  const headers = await getAuthHeader(user);

  console.log('Chamando:', `${API_URL}/clima/atual`);

  try {
    const response = await fetch(`${API_URL}/clima/atual`, {
      method: 'GET',
      headers,
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro buscarClimaAtual:', error);
    throw error;
  }
}

// ========================================
// TRANSPORTE
// ========================================
export async function buscarImpactosTransporte(user) {
  const headers = await getAuthHeader(user);

  console.log('Chamando:', `${API_URL}/transporte/impactos`);

  try {
    const response = await fetch(`${API_URL}/transporte/impactos`, {
      method: 'GET',
      headers,
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro buscarImpactosTransporte:', error);
    throw error;
  }
}

// ========================================
// ZONAS DE ALAGAMENTO
// ========================================
export async function buscarZonasAlagamento(user) {
  const headers = await getAuthHeader(user);

  console.log('Chamando:', `${API_URL}/zonas-alagamento`);

  try {
    const response = await fetch(`${API_URL}/zonas-alagamento`, {
      method: 'GET',
      headers,
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro buscarZonasAlagamento:', error);
    throw error;
  }
}

// ========================================
// PREFERENCIAS
// ========================================
export async function buscarPreferencias(user) {
  const headers = await getAuthHeader(user);

  console.log('Chamando:', `${API_URL}/preferencias`);

  try {
    const response = await fetch(`${API_URL}/preferencias`, {
      method: 'GET',
      headers,
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro buscarPreferencias:', error);
    throw error;
  }
}

export async function criarPreferencias(user, { transit_lines, neighborhoods, notify_rain, notify_uv, notify_transit, notify_flood }) {
  const headers = await getAuthHeader(user);

  console.log('Chamando:', `${API_URL}/preferencias`);

  try {
    const response = await fetch(`${API_URL}/preferencias`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ transit_lines, neighborhoods, notify_rain, notify_uv, notify_transit, notify_flood }),
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro criarPreferencias:', error);
    throw error;
  }
}

export async function atualizarPreferencias(user, { transit_lines, neighborhoods, notify_rain, notify_uv, notify_transit, notify_flood }) {
  const headers = await getAuthHeader(user);

  console.log('Chamando:', `${API_URL}/preferencias`);

  try {
    const response = await fetch(`${API_URL}/preferencias`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ transit_lines, neighborhoods, notify_rain, notify_uv, notify_transit, notify_flood }),
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro atualizarPreferencias:', error);
    throw error;
  }
}

export async function deletarPreferencias(user) {
  const headers = await getAuthHeader(user);

  console.log('Chamando:', `${API_URL}/preferencias`);

  try {
    const response = await fetch(`${API_URL}/preferencias`, {
      method: 'DELETE',
      headers,
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro deletarPreferencias:', error);
    throw error;
  }
}

// ========================================
// ROTAS FAVORITAS
// ========================================
export async function listarRotas(user) {
  const headers = await getAuthHeader(user);

  console.log('Chamando:', `${API_URL}/rotas`);

  try {
    const response = await fetch(`${API_URL}/rotas`, {
      method: 'GET',
      headers,
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro listarRotas:', error);
    throw error;
  }
}

export async function criarRota(user, { nome, origem, destino, horario_saida, linha_metro }) {
  const headers = await getAuthHeader(user);

  console.log('Chamando:', `${API_URL}/rotas`);

  try {
    const response = await fetch(`${API_URL}/rotas`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ nome, origem, destino, horario_saida, linha_metro }),
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro criarRota:', error);
    throw error;
  }
}

export async function editarRota(user, id, { nome, origem, destino, horario_saida, linha_metro }) {
  const headers = await getAuthHeader(user);

  console.log('Chamando:', `${API_URL}/rotas/${id}`);

  try {
    const response = await fetch(`${API_URL}/rotas/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ nome, origem, destino, horario_saida, linha_metro }),
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro editarRota:', error);
    throw error;
  }
}

export async function deletarRota(user, id) {
  const headers = await getAuthHeader(user);

  console.log('Chamando:', `${API_URL}/rotas/${id}`);

  try {
    const response = await fetch(`${API_URL}/rotas/${id}`, {
      method: 'DELETE',
      headers,
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro deletarRota:', error);
    throw error;
  }
}

export async function analisarRota(user, id) {
  const headers = await getAuthHeader(user);

  console.log('Chamando:', `${API_URL}/rotas/${id}/analise`);

  try {
    const response = await fetch(`${API_URL}/rotas/${id}/analise`, {
      method: 'GET',
      headers,
    });

    return await parseResponse(response);
  } catch (error) {
    console.log('Erro analisarRota:', error);
    throw error;
  }
}