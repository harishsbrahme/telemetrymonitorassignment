export interface HistoryPoint {
  time: string;
  value: number;
}

export interface Parameter {
  value: number;
  unit: string;
  history: HistoryPoint[];
}

export interface DashboardResponse {
  timestamp: string;
  velocity: Parameter;
  pressure: Parameter;
  temperature: Parameter;
}

export type ParameterName = 'velocity' | 'pressure' | 'temperature';
