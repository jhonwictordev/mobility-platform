'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    totalUsers: 7,
    totalDrivers: 4,
    onlineDrivers: 3,
    totalTrips: 3,
    activeTrips: 1,
    totalRevenue: 33.95,
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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-[#123D32] via-[#1A5243] to-[#123D32] rounded-3xl p-8 text-white shadow-lg border border-[#16A572]/40 relative overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full border-8 border-[#16A572]/15 pointer-events-none"></div>
        <div className="absolute right-20 -bottom-20 w-80 h-80 rounded-full border-8 border-[#FFCC45]/15 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#17211D]/60 border border-[#16A572]/50 px-3 py-1 rounded-full text-xs font-bold text-[#FFCC45]">
              <span>📍 Polo Operacional Alagoas</span>
              <span>•</span>
              <span>Penedo ⇄ Piaçabuçu</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              Painel de Operações SIMBORA
            </h1>
            <p className="text-sm text-slate-200 max-w-xl">
              Monitoramento em tempo real de frota, despacho geoespacial, receita e corridas no litoral e Baixo São Francisco.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/studio"
              className="px-5 py-3 rounded-xl bg-[#FFCC45] hover:bg-[#F59E0B] text-[#123D32] font-black text-sm shadow-md transition flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>⚡</span>
              <span>Abrir SIMBORA Studio</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs hover:border-[#16A572] transition group">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold text-[#123D32] uppercase tracking-wider">
              Faturamento Consolidado
            </p>
            <span className="p-2 rounded-lg bg-[#DCFCE7] text-[#16A572] text-xs font-black">
              R$
            </span>
          </div>
          <p className="text-3xl font-black text-[#123D32] mt-3 tracking-tight">
            R$ {metrics.totalRevenue.toFixed(2)}
          </p>
          <p className="text-xs text-[#16A572] font-bold mt-2 flex items-center gap-1">
            <span>↑ 100% repasse automatizado</span>
          </p>
        </div>

        {/* Online Drivers */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs hover:border-[#16A572] transition group">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold text-[#123D32] uppercase tracking-wider">
              Frota Online
            </p>
            <span className="p-2 rounded-lg bg-[#DCFCE7] text-[#16A572] text-xs">
              🚗
            </span>
          </div>
          <p className="text-3xl font-black text-[#16A572] mt-3 tracking-tight">
            {metrics.onlineDrivers}{' '}
            <span className="text-sm font-semibold text-slate-400">
              / {metrics.totalDrivers} homologados
            </span>
          </p>
          <p className="text-xs text-slate-500 font-semibold mt-2">
            Região: Orla de Penedo & Piaçabuçu
          </p>
        </div>

        {/* Total Trips */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs hover:border-[#16A572] transition group">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold text-[#123D32] uppercase tracking-wider">
              Corridas Realizadas
            </p>
            <span className="p-2 rounded-lg bg-[#FEF3C7] text-[#B45309] text-xs">
              🛣️
            </span>
          </div>
          <p className="text-3xl font-black text-[#17211D] mt-3 tracking-tight">
            {metrics.totalTrips}
          </p>
          <p className="text-xs text-[#16A572] font-bold mt-2">
            {metrics.activeTrips} em andamento na AL-101 / AL-225
          </p>
        </div>

        {/* Active Passengers */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs hover:border-[#16A572] transition group">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold text-[#123D32] uppercase tracking-wider">
              Passageiros Cadastrados
            </p>
            <span className="p-2 rounded-lg bg-[#E0E7FF] text-[#3730A3] text-xs">
              👥
            </span>
          </div>
          <p className="text-3xl font-black text-[#17211D] mt-3 tracking-tight">
            {metrics.totalUsers}
          </p>
          <p className="text-xs text-[#123D32] font-bold mt-2">
            Verificados com PIN de segurança
          </p>
        </div>
      </div>

      {/* Fleet & Active Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Drivers Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-black text-[#123D32]">
                Frota em Destaque — Penedo & Piaçabuçu
              </h2>
              <p className="text-xs text-slate-500">
                Rastreamento contínuo via Haversine & telemetria GPS a cada 3s
              </p>
            </div>
            <Link
              href="/drivers"
              className="text-xs font-bold text-[#16A572] hover:underline"
            >
              Ver todos →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#123D32] text-white flex items-center justify-center font-bold text-sm">
                  CO
                </div>
                <div>
                  <p className="font-bold text-sm text-[#17211D]">Carlos Oliveira</p>
                  <p className="text-xs text-slate-500">Toyota Corolla Hybrid • BRA2E19</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#166534]">
                  <span className="w-2 h-2 rounded-full bg-[#16A572]"></span>
                  ONLINE • AL-101
                </span>
                <p className="text-xs text-[#FFCC45] font-black mt-0.5">⭐ 4.95 (342)</p>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#123D32] text-white flex items-center justify-center font-bold text-sm">
                  RS
                </div>
                <div>
                  <p className="font-bold text-sm text-[#17211D]">Roberto Santos</p>
                  <p className="text-xs text-slate-500">Chevrolet Onix Plus • RIO4A22</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#166534]">
                  <span className="w-2 h-2 rounded-full bg-[#16A572]"></span>
                  ONLINE • Centro Penedo
                </span>
                <p className="text-xs text-[#FFCC45] font-black mt-0.5">⭐ 4.88 (189)</p>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#123D32] text-white flex items-center justify-center font-bold text-sm">
                  AS
                </div>
                <div>
                  <p className="font-bold text-sm text-[#17211D]">Amanda Souza</p>
                  <p className="text-xs text-slate-500">BMW 320i M Sport • SPX9Z99</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#166534]">
                  <span className="w-2 h-2 rounded-full bg-[#16A572]"></span>
                  ONLINE • Pontal do Peba
                </span>
                <p className="text-xs text-[#FFCC45] font-black mt-0.5">⭐ 5.00 (82)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Quick Actions & Slogan Card */}
        <div className="bg-[#123D32] rounded-3xl p-6 text-white border border-[#16A572]/40 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-black text-[#FFCC45] uppercase tracking-widest">
                SIMBORA STUDIO
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A572] animate-pulse"></span>
            </div>
            <h3 className="text-xl font-black text-white">
              Simulador Alagoas
            </h3>
            <p className="text-xs text-slate-200 mt-2 leading-relaxed">
              Execute testes de despacho geográfico ponta a ponta com visualização simultânea dos celulares de Passageiro e Motorista.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-[#0E2922] border border-[#16A572]/30 space-y-1">
              <p className="text-xs font-bold text-[#FFCC45]">Cenário Principal Ativo:</p>
              <p className="text-xs text-slate-200 font-semibold">Piaçabuçu (Foz) ➔ Penedo (Centro)</p>
              <p className="text-[11px] text-[#16A572]">28.4 km • ~28 min de trajeto</p>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/studio"
              className="w-full py-3.5 px-4 rounded-xl bg-[#16A572] hover:bg-[#138e62] text-white font-extrabold text-xs text-center block transition shadow-md"
            >
              TESTAR PIAÇABUÇU ➔ PENEDO
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
