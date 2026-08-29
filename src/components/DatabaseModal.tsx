import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Layers,
  Server,
  Monitor,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Terminal,
  Play,
  FileCode,
} from 'lucide-react';
import { DbStatus } from '../types';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  dbStatus: DbStatus | null;
  onRefreshStatus: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  dbStatus,
  onRefreshStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'schema' | 'setup'>('architecture');
  const [isPinging, setIsPinging] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [schemaSql, setSchemaSql] = useState<string>('');
  const [copiedSchema, setCopiedSchema] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSchema();
    }
  }, [isOpen]);

  const fetchSchema = async () => {
    try {
      const res = await fetch('/api/db/schema');
      const text = await res.text();
      setSchemaSql(text);
    } catch (e) {
      setSchemaSql('-- Could not load schema');
    }
  };

  if (!isOpen) return null;

  const handlePing = async () => {
    setIsPinging(true);
    setActionMessage(null);
    try {
      const res = await fetch('/api/db/ping');
      const data = await res.json();
      if (data.success) {
        setActionMessage({
          type: 'success',
          text: `Ping successful! Latency: ${data.latencyMs}ms`,
        });
      } else {
        setActionMessage({
          type: 'error',
          text: `PostgreSQL connection test: ${data.error || 'Server unreachable'}`,
        });
      }
      onRefreshStatus();
    } catch (e: any) {
      setActionMessage({ type: 'error', text: e.message });
    } finally {
      setIsPinging(false);
    }
  };

  const handleInitDb = async () => {
    setIsInitializing(true);
    setActionMessage(null);
    try {
      const res = await fetch('/api/db/init', { method: 'POST' });
      const data = await res.json();
      setActionMessage({
        type: data.success ? 'success' : 'error',
        text: data.message || 'Database schema initialized',
      });
      onRefreshStatus();
    } catch (e: any) {
      setActionMessage({ type: 'error', text: e.message });
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    setActionMessage(null);
    try {
      const res = await fetch('/api/db/seed', { method: 'POST' });
      const data = await res.json();
      setActionMessage({
        type: data.success ? 'success' : 'error',
        text: data.message || 'Sample data seeded',
      });
      onRefreshStatus();
    } catch (e: any) {
      setActionMessage({ type: 'error', text: e.message });
    } finally {
      setIsSeeding(false);
    }
  };

  const copySchemaToClipboard = () => {
    navigator.clipboard.writeText(schemaSql);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#0F0F0F] border-4 border-[#F5F5F5] max-w-2xl w-full shadow-2xl text-[#F5F5F5] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b-2 border-[#F5F5F5] bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00FF41]/10 border border-[#00FF41]/30 flex items-center justify-center text-[#00FF41]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#00FF41] block">
                SYSTEM ARCHITECTURE
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#F5F5F5]">
                3-TIER DATA DIAGNOSTIC
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-[#F5F5F5]/30 bg-[#0F0F0F] text-[#F5F5F5] hover:border-[#FF3333] hover:text-[#FF3333] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b-2 border-[#F5F5F5]/20 bg-[#141414] px-6 pt-3 gap-6 text-xs font-mono font-black uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'architecture'
                ? 'border-[#00FF41] text-[#00FF41]'
                : 'border-transparent text-[#F5F5F5]/50 hover:text-[#F5F5F5]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>DIAGNOSTICS</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'schema'
                ? 'border-[#00FF41] text-[#00FF41]'
                : 'border-transparent text-[#F5F5F5]/50 hover:text-[#F5F5F5]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>SQL SCHEMA (DDL)</span>
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'setup'
                ? 'border-[#00FF41] text-[#00FF41]'
                : 'border-transparent text-[#F5F5F5]/50 hover:text-[#F5F5F5]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>SETUP INSTRUCTIONS</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6">
          {actionMessage && (
            <div
              className={`mb-4 p-3 border-2 font-mono text-xs uppercase font-bold flex items-center gap-2 ${
                actionMessage.type === 'success'
                  ? 'bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]'
                  : 'bg-[#FF3333]/10 text-[#FF3333] border-[#FF3333]'
              }`}
            >
              {actionMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00FF41]" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-[#FF3333]" />
              )}
              <span>{actionMessage.text}</span>
            </div>
          )}

          {/* TAB 1: ARCHITECTURE & STATUS */}
          {activeTab === 'architecture' && (
            <div className="space-y-5">
              {/* 3-Tier Visual Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Tier 1 */}
                <div className="p-4 border-2 border-[#F5F5F5]/20 bg-[#141414]">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#00FF41] mb-2">
                    <Monitor className="w-3.5 h-3.5" />
                    <span>TIER 1: CLIENT</span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-sm uppercase text-[#F5F5F5]">React 19 + Tailwind</p>
                    <p className="text-[11px] font-mono text-[#F5F5F5]/50 uppercase">
                      SINGLE PAGE UI, REAL-TIME FILTERS, STATS.
                    </p>
                  </div>
                </div>

                {/* Tier 2 */}
                <div className="p-4 border-2 border-[#F5F5F5]/20 bg-[#141414]">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#00FF41] mb-2">
                    <Server className="w-3.5 h-3.5" />
                    <span>TIER 2: LOGIC</span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-sm uppercase text-[#F5F5F5]">Node.js + Express</p>
                    <p className="text-[11px] font-mono text-[#F5F5F5]/50 uppercase">
                      REST API (/api/expenses), CONNECTION POOL.
                    </p>
                  </div>
                </div>

                {/* Tier 3 */}
                <div className="p-4 border-2 border-[#00FF41]/40 bg-[#00FF41]/5">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#00FF41] mb-2">
                    <Database className="w-3.5 h-3.5" />
                    <span>TIER 3: DATABASE</span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-sm uppercase text-[#00FF41]">PostgreSQL (pg Pool)</p>
                    <p className="text-[11px] font-mono text-[#F5F5F5]/50 uppercase">
                      TABLES: EXPENSES, CATEGORIES, INDEXES.
                    </p>
                  </div>
                </div>
              </div>

              {/* Live Connection Details Box */}
              <div className="p-4 border-2 border-[#F5F5F5]/20 bg-[#141414] text-xs font-mono space-y-2">
                <div className="flex items-center justify-between border-b border-[#F5F5F5]/10 pb-2">
                  <span className="text-[#F5F5F5]/50 uppercase">Connection Mode:</span>
                  <span className="font-bold text-[#00FF41]">{dbStatus?.mode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#F5F5F5]/50 uppercase">Host & Port:</span>
                  <span className="text-[#F5F5F5]">
                    {dbStatus?.host}:{dbStatus?.port}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#F5F5F5]/50 uppercase">Database Name:</span>
                  <span className="text-[#F5F5F5]">{dbStatus?.database}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#F5F5F5]/50 uppercase">PostgreSQL User:</span>
                  <span className="text-[#F5F5F5]">{dbStatus?.user}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#F5F5F5]/50 uppercase">Total Logged Rows:</span>
                  <span className="text-[#00FF41] font-black">{dbStatus?.rowCount} RECORDS</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#F5F5F5]/50 uppercase">Roundtrip Latency:</span>
                  <span className="text-[#F5F5F5]">{dbStatus?.latencyMs}ms</span>
                </div>
              </div>

              {/* Actions & Diagnostics */}
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={handlePing}
                  disabled={isPinging}
                  className="px-4 py-2 border-2 border-[#F5F5F5]/30 bg-[#141414] hover:border-[#00FF41] text-[#F5F5F5] hover:text-[#00FF41] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-[#00FF41]' : ''}`} />
                  <span>TEST CONNECTION / PING</span>
                </button>

                <button
                  onClick={handleInitDb}
                  disabled={isInitializing}
                  className="px-4 py-2 border-2 border-[#F5F5F5]/30 bg-[#141414] hover:border-[#00FF41] text-[#F5F5F5] hover:text-[#00FF41] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 text-[#00FF41]" />
                  <span>RUN SCHEMA DDL</span>
                </button>

                <button
                  onClick={handleSeed}
                  disabled={isSeeding}
                  className="px-4 py-2 bg-[#00FF41] hover:bg-white text-[#0F0F0F] text-xs font-black uppercase tracking-tight flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>RESET & SEED SAMPLE DATA</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SCHEMA (DDL) */}
          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-[#F5F5F5]/70">
                  database/schema.sql (PostgreSQL DDL)
                </span>
                <button
                  onClick={copySchemaToClipboard}
                  className="flex items-center gap-1 text-xs font-mono font-bold uppercase text-[#0F0F0F] bg-[#00FF41] hover:bg-white px-3 py-1 transition-all"
                >
                  {copiedSchema ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY SQL</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 bg-[#141414] text-[#00FF41] border-2 border-[#F5F5F5]/20 text-xs font-mono overflow-x-auto max-h-72 leading-relaxed">
                {schemaSql}
              </pre>
            </div>
          )}

          {/* TAB 3: LOCAL SETUP GUIDE */}
          {activeTab === 'setup' && (
            <div className="space-y-4 text-xs font-mono text-[#F5F5F5]/80 max-h-80 overflow-y-auto pr-1">
              <div>
                <h4 className="font-black text-[#00FF41] text-xs uppercase tracking-wider mb-1">
                  1. LOCAL POSTGRESQL SETUP (NO DOCKER)
                </h4>
                <p className="text-[#F5F5F5]/60 mb-2 uppercase">
                  Install PostgreSQL on your local machine using standard package managers:
                </p>
                <div className="p-3 bg-[#141414] border border-[#F5F5F5]/20 text-[#00FF41] space-y-1">
                  <p className="text-[#F5F5F5]/50"># macOS (Homebrew):</p>
                  <p>brew install postgresql@16 && brew services start postgresql@16</p>
                  <p className="text-[#F5F5F5]/50 mt-2"># Ubuntu / Debian:</p>
                  <p>sudo apt update && sudo apt install -y postgresql postgresql-contrib && sudo systemctl start postgresql</p>
                  <p className="text-[#F5F5F5]/50 mt-2"># Windows:</p>
                  <p>winget install PostgreSQL.PostgreSQL</p>
                </div>
              </div>

              <div>
                <h4 className="font-black text-[#00FF41] text-xs uppercase tracking-wider mb-1">
                  2. CREATE DATABASE & USER
                </h4>
                <div className="p-3 bg-[#141414] border border-[#F5F5F5]/20 text-[#00FF41]">
                  <p>psql -U postgres -c "CREATE DATABASE expense_db;"</p>
                </div>
              </div>

              <div>
                <h4 className="font-black text-[#00FF41] text-xs uppercase tracking-wider mb-1">
                  3. RUN DATABASE INITIALIZATION SCRIPT
                </h4>
                <div className="p-3 bg-[#141414] border border-[#F5F5F5]/20 text-[#00FF41]">
                  <p>npm run db:init</p>
                </div>
                <p className="text-[#F5F5F5]/50 mt-1 uppercase">
                  This command connects to PostgreSQL, creates all tables, triggers, indexes, and populates default categories and seed records.
                </p>
              </div>

              <div>
                <h4 className="font-black text-[#00FF41] text-xs uppercase tracking-wider mb-1">
                  4. START DEV SERVER
                </h4>
                <div className="p-3 bg-[#141414] border border-[#F5F5F5]/20 text-[#00FF41]">
                  <p>npm run dev</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t-2 border-[#F5F5F5]/20 bg-[#141414] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#F5F5F5] bg-[#0F0F0F] border-2 border-[#F5F5F5]/30 hover:border-[#00FF41] hover:text-[#00FF41] transition-all"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
