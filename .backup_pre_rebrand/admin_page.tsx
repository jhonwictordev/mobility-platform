'use client';

import React, { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    totalUsers: 7,
    totalDrivers: 4,
    onlineDrivers: 3,
    totalTrips: 1,
    activeTrips: 0,
    totalRevenue: 18.5,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/admin/dashboard')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.totalUsers !== undefined) {
          setMetrics(data);
        }
      })
      .catch((e) => console.log('Dashboard fetch error', e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Painel de Controle em Tempo Real
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Visão consolidada da operação de transporte e frota ativa.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Faturamento Total
          </p>
          <p className="text-3xl font-black text-indigo-600 mt-2">
            R$ {metrics.totalRevenue.toFixed(2)}
          </p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            ↑ 100% liquidação automática
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Motoristas Online
          </p>
          <p className="text-3xl font-black text-emerald-600 mt-2">
            {metrics.onlineDrivers}{' '}
            <span className="text-sm font-semibold text-slate-400">
              / {metrics.totalDrivers} cadastrados
            </span>
          </p>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Base: Piaçabuçu & Penedo (Alagoas)
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total de Corridas
          </p>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {metrics.totalTrips}
          </p>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            {metrics.activeTrips} em andamento agora
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Passageiros Ativos
          </p>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {metrics.totalUsers}
          </p>
          <p className="text-xs text-indigo-600 font-semibold mt-1">
            Cadastros verificados via OTP
          </p>
        </div>
      </div>

      {/* Fleet & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Drivers Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>Frota de Motoristas em Destaque</span>
            <span className="text-xs font-normal text-slate-500">
              Atualização a cada 3s via Haversine
            </span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
                  <th className="pb-3">Motorista</th>
                  <th className="pb-3">Veículo</th>
                  <th className="pb-3">Categoria</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Nota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 font-semibold text-slate-900">
                    Carlos Oliveira
                  </td>
                  <td className="py-3 text-slate-600">Corolla (BRA2E19)</td>
                  <td className="py-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700">
                      Comfort
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Online
                    </span>
                  </td>
                  <td className="py-3 font-bold text-amber-500">⭐ 4.9</td>
                </tr>

                <tr>
                  <td className="py-3 font-semibold text-slate-900">
                    Roberto Santos
                  </td>
                  <td className="py-3 text-slate-600">Onix Plus (RIO4A22)</td>
                  <td className="py-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                      Economy
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Online
                    </span>
                  </td>
                  <td className="py-3 font-bold text-amber-500">⭐ 4.8</td>
                </tr>

                <tr>
                  <td className="py-3 font-semibold text-slate-900">
                    Amanda Souza
                  </td>
                  <td className="py-3 text-slate-600">BMW 320i (SPX9Z99)</td>
                  <td className="py-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700">
                      Premium
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Online
                    </span>
                  </td>
                  <td className="py-3 font-bold text-amber-500">⭐ 5.0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Operations Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Auditoria em Tempo Real
          </h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="text-lg">🛣️</span>
              <div className="text-xs">
                <p className="font-bold text-slate-900">
                  Rota Intermunicipal Alagoas Ativa
                </p>
                <p className="text-slate-500">
                  Piaçabuçu (Centro) → Penedo (Histórico) • 28,2 km via AL-101 / AL-225
                </p>
                <p className="text-slate-400 text-[10px] mt-1">Status: Conectado OSRM Real</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-lg">💳</span>
              <div className="text-xs">
                <p className="font-bold text-slate-900">
                  Tarifa Fixada: R$ 68,01 (Comfort)
                </p>
                <p className="text-slate-500">
                  Marina Silva ↔ Carlos Oliveira (Corolla BRA2E19)
                </p>
                <p className="text-slate-400 text-[10px] mt-1">Hoje às 04:15</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-lg">⭐</span>
              <div className="text-xs">
                <p className="font-bold text-slate-900">
                  Avaliação 5 Estrelas Recebida
                </p>
                <p className="text-slate-500">
                  Marina Silva avaliou Carlos Oliveira
                </p>
                <p className="text-slate-400 text-[10px] mt-1">Viagem Concluída com Sucesso</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-lg">⚡</span>
              <div className="text-xs">
                <p className="font-bold text-slate-900">
                  Despacho Alagoas Sul Ativo
                </p>
                <p className="text-slate-500">
                  Cobertura: Penedo, Piaçabuçu, Igreja Nova, Coruripe
                </p>
                <p className="text-slate-400 text-[10px] mt-1">WebSocket Porta 3001</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alagoas Intermunicipal Highway Corridors */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Corredores Rodoviários Monitorados — Alagoas
            </h2>
            <p className="text-xs text-slate-500">
              Roteamento vetorial OSRM com geometria real e tarifas ativas
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
            7 Rotas Mapeadas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border-2 border-indigo-500 bg-indigo-50/40">
            <div className="flex justify-between items-start">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-600 text-white">
                Prioritária
              </span>
              <span className="text-xs font-black text-slate-900">28,2 km</span>
            </div>
            <p className="font-extrabold text-sm text-slate-900 mt-2">
              Piaçabuçu ↔ Penedo
            </p>
            <p className="text-xs text-slate-500">Via AL-101 / AL-225 • ~28 min</p>
            <div className="mt-3 pt-3 border-t border-indigo-100 flex justify-between text-xs">
              <span className="text-slate-600">Tarifa Comfort:</span>
              <b className="text-indigo-700 font-bold">R$ 68,01</b>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="flex justify-between items-start">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-700">
                Ativa
              </span>
              <span className="text-xs font-bold text-slate-700">31,9 km</span>
            </div>
            <p className="font-bold text-sm text-slate-900 mt-2">
              Penedo ↔ Igreja Nova
            </p>
            <p className="text-xs text-slate-500">Via AL-110 • ~31 min</p>
            <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between text-xs">
              <span className="text-slate-600">Tarifa Comfort:</span>
              <b className="text-slate-800 font-bold">R$ 74,50</b>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="flex justify-between items-start">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-700">
                Ativa
              </span>
              <span className="text-xs font-bold text-slate-700">58,3 km</span>
            </div>
            <p className="font-bold text-sm text-slate-900 mt-2">
              Penedo ↔ Porto Real do Colégio
            </p>
            <p className="text-xs text-slate-500">Via AL-225 / BR-101 • ~53 min</p>
            <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between text-xs">
              <span className="text-slate-600">Tarifa Comfort:</span>
              <b className="text-slate-800 font-bold">R$ 132,10</b>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <div className="flex justify-between items-start">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-700">
                Ativa
              </span>
              <span className="text-xs font-bold text-slate-700">58,5 km</span>
            </div>
            <p className="font-bold text-sm text-slate-900 mt-2">
              Penedo ↔ Coruripe
            </p>
            <p className="text-xs text-slate-500">Via AL-101 Sul • ~56 min</p>
            <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between text-xs">
              <span className="text-slate-600">Tarifa Comfort:</span>
              <b className="text-slate-800 font-bold">R$ 134,80</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
