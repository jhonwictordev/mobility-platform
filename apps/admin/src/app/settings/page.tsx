'use client';

import React, { useState, useEffect } from 'react';

export default function SettingsAdminPage() {
  const [surge, setSurge] = useState(1.0);
  const [commission, setCommission] = useState(15);
  const [saved, setSaved] = useState(false);

  // MapTiler Configuration State
  const [maptilerKey, setMaptilerKey] = useState('7bwWEW7XuNoRCA0JLIOJ');
  const [mapStatus, setMapStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [mapPingMs, setMapPingMs] = useState<number | null>(null);

  useEffect(() => {
    // 1. Fetch config from NestJS API
    fetch('http://localhost:3001/location/config')
      .then((r) => r.json())
      .then((cfg) => {
        if (cfg.maptilerKey) {
          setMaptilerKey(cfg.maptilerKey);
        }
      })
      .catch(() => {});

    // 2. Test MapTiler connectivity
    verifyMapTilerConnection('7bwWEW7XuNoRCA0JLIOJ');
  }, []);

  const verifyMapTilerConnection = async (key: string) => {
    setMapStatus('testing');
    const start = performance.now();
    try {
      const res = await fetch(`https://api.maptiler.com/maps/streets-v2/style.json?key=${key.trim()}`);
      const duration = Math.round(performance.now() - start);
      if (res.ok) {
        setMapStatus('connected');
        setMapPingMs(duration);
      } else {
        setMapStatus('error');
      }
    } catch {
      setMapStatus('error');
    }
  };

  const handleUpdateSurge = async (val: number) => {
    setSurge(val);
    try {
      await fetch('http://localhost:3001/pricing/surge', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ multiplier: val }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.log('Error surge', e);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-[#123D32] tracking-tight">
          Configurações de Tarifas e Mapas — SIMBORA
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Ajuste de precificação dinâmica, provedor cartográfico MapTiler Cloud e categorias para Alagoas.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-[#DCFCE7] border border-[#16A572] text-[#166534] rounded-2xl text-sm font-bold shadow-xs">
          ✅ Configurações salvas e aplicadas em tempo real em Penedo e Piaçabuçu!
        </div>
      )}

      {/* Cartographic Engine / MapTiler Cloud */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-[#123D32] flex items-center gap-2">
            <span>🗺️</span>
            <span>Motor Cartográfico MapTiler Cloud (Alagoas HD)</span>
          </h2>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              mapStatus === 'connected'
                ? 'bg-[#DCFCE7] text-[#166534]'
                : mapStatus === 'testing'
                ? 'bg-[#FEF3C7] text-[#B45309]'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {mapStatus === 'connected' && `● Conectado (${mapPingMs}ms • HTTP 200)`}
            {mapStatus === 'testing' && '● Verificando API...'}
            {mapStatus === 'error' && '● Erro de Conexão'}
          </span>
        </div>

        <p className="text-xs text-slate-500">
          Chave ativa utilizada para renderização vetorial das rotas rodoviárias em Piaçabuçu, Penedo e AL-101 Sul.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#123D32] mb-1">
              Chave de API MapTiler (VITE_MAPTILER_KEY):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={maptilerKey}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 select-all"
              />
              <button
                onClick={() => verifyMapTilerConnection(maptilerKey)}
                className="px-4 py-2 bg-[#123D32] hover:bg-[#1A5243] text-white text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer transition"
              >
                Testar Ping
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <a
              href="http://localhost:8080"
              target="_blank"
              rel="noreferrer"
              className="w-full text-center px-4 py-2 bg-[#16A572] hover:bg-[#139063] text-white text-xs font-black rounded-xl cursor-pointer transition shadow-xs"
            >
              Abrir SIMBORA Studio ➔
            </a>
          </div>
        </div>
      </div>

      {/* Dynamic Pricing / Surge Multiplier */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <h2 className="text-base font-black text-[#123D32] flex items-center gap-2">
          <span>⚡</span>
          <span>Multiplicador de Demanda Dinâmica (Surge)</span>
        </h2>
        <p className="text-xs text-slate-500">
          Ajuste temporário para horários de pico (ex: travessia de balsas em Penedo, feiras livres e fins de semana em Pontal do Peba).
        </p>

        <div className="flex items-center gap-6 pt-2">
          <input
            type="range"
            min="1.0"
            max="3.0"
            step="0.1"
            value={surge}
            onChange={(e) => handleUpdateSurge(parseFloat(e.target.value))}
            className="flex-1 accent-[#16A572] h-2 bg-slate-100 rounded-lg cursor-pointer"
          />
          <span className="text-2xl font-black text-[#16A572] font-mono w-16 text-right">
            {surge.toFixed(1)}x
          </span>
        </div>
      </div>

      {/* Categories Base Pricing */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-black text-[#123D32]">
            Tabela de Tarifas por Categoria Oficial SIMBORA
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tarifas calibradas para o poder de compra e distâncias da região do Baixo São Francisco.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Economy */}
          <div className="p-5 bg-[#F8F9F6] rounded-2xl border border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-[#123D32] text-sm">Simbora Econômico</h3>
              <span>🚗</span>
            </div>
            <p className="text-[11px] text-slate-500">Corridas curtas urbanas dentro de Penedo ou Piaçabuçu.</p>
            <div className="text-xs text-slate-700 space-y-1.5 pt-2 border-t border-slate-200">
              <p>Tarifa Base: <b>R$ 5,00</b></p>
              <p>Por Km: <b>R$ 1,50</b></p>
              <p>Por Minuto: <b>R$ 0,25</b></p>
              <p className="text-[#16A572] font-black">Tarifa Mínima: R$ 8,00</p>
            </div>
          </div>

          {/* Comfort */}
          <div className="p-5 bg-gradient-to-br from-[#DCFCE7]/40 to-white rounded-2xl border border-[#16A572]/40 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-[#123D32] text-sm">Simbora Conforto</h3>
              <span>🚙</span>
            </div>
            <p className="text-[11px] text-slate-500">Carros novos com ar condicionado obrigatório.</p>
            <div className="text-xs text-slate-700 space-y-1.5 pt-2 border-t border-slate-200">
              <p>Tarifa Base: <b>R$ 7,00</b></p>
              <p>Por Km: <b>R$ 2,20</b></p>
              <p>Por Minuto: <b>R$ 0,35</b></p>
              <p className="text-[#16A572] font-black">Tarifa Mínima: R$ 12,00</p>
            </div>
          </div>

          {/* Intermunicipal */}
          <div className="p-5 bg-gradient-to-br from-[#FEF3C7]/40 to-white rounded-2xl border border-[#FFCC45]/60 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-[#B45309] text-sm">Intermunicipal AL</h3>
              <span>✨</span>
            </div>
            <p className="text-[11px] text-slate-500">Trajeto completo Piaçabuçu ⇄ Penedo (28.4 km).</p>
            <div className="text-xs text-slate-700 space-y-1.5 pt-2 border-t border-slate-200">
              <p>Tarifa Base: <b>R$ 12,00</b></p>
              <p>Por Km: <b>R$ 2,00</b></p>
              <p>Por Minuto: <b>R$ 0,30</b></p>
              <p className="text-[#B45309] font-black">Estimativa Rota: ~R$ 38,50</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
