
export enum RiskLevel {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  SECURE = 'Secure'
}

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  currency: string;
  region: 'Indian' | 'Western';
}

export interface SecurityMetric {
  category: string;
  score: number;
}

export interface SecurityFinding {
  title: string;
  description: string;
  severity: RiskLevel;
  recommendation: string;
  category: 'Network' | 'Identity' | 'Data' | 'Cloud' | 'Endpoint';
}

export interface AuditReport {
  id: string;
  timestamp: string;
  overallScore: number;
  summary: string;
  findings: SecurityFinding[];
  metrics: SecurityMetric[];
  roadmap: string[];
}

export interface SurveyData {
  companySize: string;
  industry: string;
  cloudProviders: string[];
  mfaUsage: string;
  dataBackupFrequency: string;
  employeeTraining: string;
  incidentResponsePlan: string;
  knownThreats: string;
  securityBudget: string;
  infrastructureNotes: string;
}

export interface IncidentData {
  type: string;
  discoveryTime: string;
  impactedAssets: string[];
  financialLoss: string;
  description: string;
  currentStatus: 'contained' | 'spreading' | 'unknown';
  rating?: number;
  feedback?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  type: 'module' | 'report' | 'action' | 'ai_suggest';
  description: string;
  view?: ViewState;
  metadata?: any;
}

export type ViewState = 'login' | 'dashboard' | 'survey' | 'audit' | 'report' | 'loading' | 'incident-report' | 'spam-defense' | 'audit-history' | 'fraud-suggestions';
