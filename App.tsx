
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SecuritySurvey from './components/SecuritySurvey';
import AuditReportView from './components/AuditReportView';
import VulnerabilityScanner from './components/VulnerabilityScanner';
import IncidentReporter from './components/IncidentReporter';
import LanguageSelector from './components/LanguageSelector';
import SpamDefense from './components/SpamDefense';
import FraudSuggestions from './components/FraudSuggestions';
import HistoryView from './components/HistoryView';
import Login from './components/Login';
import { generateSecurityReport } from './services/geminiService';
import { ViewState, SurveyData, AuditReport, LanguageConfig } from './types';

const App: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageConfig | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [auditData, setAuditData] = useState<AuditReport | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const savedLang = localStorage.getItem('cyberguard_lang');
    const savedAuth = localStorage.getItem('cyberguard_auth');
    
    if (savedLang) setSelectedLanguage(JSON.parse(savedLang));
    if (savedAuth === 'true') setIsAuthenticated(true);
    setIsInitializing(false);
  }, []);

  const handleLanguageSelect = (lang: LanguageConfig) => {
    setSelectedLanguage(lang);
    localStorage.setItem('cyberguard_lang', JSON.stringify(lang));
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('cyberguard_auth', 'true');
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuditData(null);
    setSelectedLanguage(null);
    localStorage.removeItem('cyberguard_auth');
    localStorage.removeItem('cyberguard_lang');
    setCurrentView('dashboard');
  };

  const saveToHistory = (report: AuditReport) => {
    const history = JSON.parse(localStorage.getItem('audit_history') || '[]');
    const updated = [report, ...history].slice(0, 10);
    localStorage.setItem('audit_history', JSON.stringify(updated));
  };

  const handleSurveySubmit = async (data: SurveyData) => {
    setIsProcessing(true);
    setCurrentView('loading');
    try {
      const report = await generateSecurityReport(data);
      setAuditData(report);
      saveToHistory(report);
      setCurrentView('report');
    } catch (error) {
      console.error("Audit generation failed:", error);
      alert("Analysis engine disconnected. Retrying...");
      setCurrentView('survey');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenReport = (report: AuditReport) => {
    setAuditData(report);
    setCurrentView('report');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!selectedLanguage) return <LanguageSelector onSelect={handleLanguageSelect} />;
  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  const renderContent = () => {
    if (currentView === 'loading') {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 animate-in fade-in">
          <div className="relative">
            <div className="w-32 h-32 border-8 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl animate-pulse shadow-lg shadow-blue-500/50"></div>
            </div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-blue-400 uppercase tracking-tighter">Gemini OS Analyzing...</h2>
            <p className="text-slate-500">Processing infrastructure telemetry for {selectedLanguage.name}...</p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard': return <Dashboard onViewChange={setCurrentView} />;
      case 'survey': return <SecuritySurvey onSubmit={handleSurveySubmit} isLoading={isProcessing} />;
      case 'fraud-suggestions': return <FraudSuggestions />;
      case 'spam-defense': return <SpamDefense />;
      case 'audit': return <VulnerabilityScanner />;
      case 'audit-history': return <HistoryView onViewReport={handleOpenReport} />;
      case 'incident-report': return <IncidentReporter onComplete={() => setCurrentView('dashboard')} language={selectedLanguage} />;
      case 'report': return auditData ? <AuditReportView report={auditData} /> : <Dashboard onViewChange={setCurrentView} />;
      default: return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <Layout 
      activeView={currentView} 
      onViewChange={setCurrentView} 
      onLogout={handleLogout}
      onOpenReport={handleOpenReport}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
