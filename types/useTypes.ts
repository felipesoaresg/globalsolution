// ------------------------------------------------------------
// Auth
// ------------------------------------------------------------
export type Usuario = {
  id: string;
  firebase_uid: string;
  name: string;
  email: string;
  created_at: string;
};

// ------------------------------------------------------------
// Score
// ------------------------------------------------------------
export type ScoreNivel = 'great' | 'ok' | 'bad' | 'critical';

export type Score = {
  id: string;
  score: number;
  level: ScoreNivel;
  summary: string;
  generated_at: string;
};

// ------------------------------------------------------------
// Clima
// ------------------------------------------------------------
export type ClimaCondicao = 'rain' | 'clear' | 'cloudy' | 'storm';

export type Clima = {
  temp_c: number;
  feels_like: number;
  humidity: number;
  rain_mm: number;
  uv_index: number;
  wind_kmh: number;
  condition: ClimaCondicao;
  recorded_at: string;
};

// ------------------------------------------------------------
// Alertas
// ------------------------------------------------------------
export type AlertaTipo = 'rain' | 'flood' | 'uv' | 'transit' | 'traffic';
export type AlertaSeveridade = 'low' | 'medium' | 'high' | 'critical';

export type Alerta = {
  id: string;
  type: AlertaTipo;
  severity: AlertaSeveridade;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string | null;
  active: boolean;
  created_at: string;
};

// ------------------------------------------------------------
// Transporte
// ------------------------------------------------------------
export type TransitoStatus = 'normal' | 'slow' | 'disrupted';
export type LinhaType = 'metro' | 'cptm' | 'bus';

export type TransitLine = {
  id: string;
  name: string;
  code: string;
  color_hex: string;
  type: LinhaType;
};

export type Impacto = {
  linha: string;
  codigo: string;
  cor: string;
  tipo: LinhaType;
  status: TransitoStatus;
  atraso_min: number;
  probabilidade: number | null;
  valid_from: string;
  valid_until: string | null;
};

// ------------------------------------------------------------
// Zonas de Alagamento
// ------------------------------------------------------------
export type RiscoNivel = 'low' | 'medium' | 'high';

export type ZonaAlagamento = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius_m: number;
  risk_level: RiscoNivel;
};

// ------------------------------------------------------------
// Preferencias
// ------------------------------------------------------------
export type Preferencias = {
  id: string;
  user_id: string;
  transit_lines: string;
  neighborhoods: string;
  notify_rain: boolean;
  notify_uv: boolean;
  notify_transit: boolean;
  notify_flood: boolean;
};

export type PreferenciasData = {
  transit_lines: string;
  neighborhoods: string;
  notify_rain: boolean;
  notify_uv: boolean;
  notify_transit: boolean;
  notify_flood: boolean;
};

// ------------------------------------------------------------
// Rotas
// ------------------------------------------------------------
export type Rota = {
  id: string;
  user_id: string;
  nome: string;
  origem: string;
  destino: string;
  horario_saida: string;
  linha_metro: string | null;
  created_at: string;
};

export type CriarRotaData = {
  nome: string;
  origem: string;
  destino: string;
  horario_saida: string;
  linha_metro?: string;
};

export type EditarRotaData = {
  nome: string;
  origem: string;
  destino: string;
  horario_saida: string;
  linha_metro?: string;
};

export type AnaliseNivel = 'ok' | 'atencao' | 'critico';

export type AnaliseRota = {
  rota: {
    nome: string;
    origem: string;
    destino: string;
    horario_saida: string;
    linha_metro: string | null;
  };
  nivel: AnaliseNivel;
  resumo: string;
  recomendacoes: string[];
  minutos_extra: number;
};