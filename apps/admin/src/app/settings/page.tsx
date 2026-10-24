'use client';

import React, { useState } from 'react';

export default function SettingsAdminPage() {
  const [surge, setSurge] = useState(1.0);
  const [commission, setCommission] = useState(15);
  const [saved, setSaved] = useState(false);

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
          Configurações de Tarifas e Comissões — SIMBORA
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Ajuste de precificação dinâmica, comissão de repasse para motoristas e categorias para Alagoas.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-[#DCFCE7] border border-[#16A572] text-[#166534] rounded-2xl text-sm font-bold shadow-xs">
          ✅ Configurações salvas e aplicadas em tempo real em Penedo e Piaçabuçu!
        </div>
      )}

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
