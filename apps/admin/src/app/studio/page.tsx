'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Route Waypoints for Piaçabuçu -> Penedo (AL-101 Sul / AL-225)
const ALAGOAS_ROUTE = [
  { step: 0, lat: -10.4058, lng: -36.4344, label: 'Praça São Francisco de Borja, Piaçabuçu (Foz)', pct: 0 },
  { step: 1, lat: -10.3850, lng: -36.4650, label: 'Acesso AL-101 Sul • Coqueirais de Piaçabuçu', pct: 20 },
  { step: 2, lat: -10.3620, lng: -36.4980, label: 'Povoado Retiro • Margem do Velho Chico', pct: 45 },
  { step: 3, lat: -10.3340, lng: -36.5350, label: 'Entroncamento AL-225 • Várzeas de Marituba', pct: 70 },
  { step: 4, lat: -10.3010, lng: -36.5680, label: 'Entrada de Penedo • Av. Wanderley', pct: 90 },
  { step: 5, lat: -10.2917, lng: -36.5819, label: 'Largo de São Gonçalo, Centro Histórico de Penedo', pct: 100 },
];

type SimStep =
  | 'IDLE'
  | 'AUTHENTICATING'
  | 'QUOTING'
  | 'REQUESTING'
  | 'SEARCHING'
  | 'OFFER_SENT'
  | 'ACCEPTED'
  | 'DRIVER_ARRIVING'
  | 'DRIVER_ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'RATED';

export default function SimboraStudioPage() {
  const [simStep, setSimStep] = useState<SimStep>('IDLE');
  const [autoPlay, setAutoPlay] = useState(false);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
  const [pinCode] = useState('7429');
  const [pinEntered, setPinEntered] = useState('');
  const [fare] = useState(38.5);
  const [category, setCategory] = useState('COMFORT');
  const [events, setEvents] = useState<Array<{ time: string; text: string; type: 'info' | 'success' | 'warn' | 'api' }>>([]);
  const [driverOnline, setDriverOnline] = useState(true);
  const [rating, setRating] = useState(5);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const addEvent = (text: string, type: 'info' | 'success' | 'warn' | 'api' = 'info') => {
    const time = new Date().toLocaleTimeString('pt-BR');
    setEvents((prev) => [{ time, text, type }, ...prev.slice(0, 40)]);
  };

  useEffect(() => {
    addEvent('SIMBORA Studio inicializado. Corredor Piaçabuçu ⇄ Penedo pronto.', 'info');
    addEvent('Motorista Carlos Oliveira conectado na AL-101 (Toyota Corolla Hybrid).', 'api');
  }, []);

  // Main Action: Trigger Full Simulation
  const startFullSimulation = () => {
    resetSimulation();
    setAutoPlay(true);
    setSimStep('AUTHENTICATING');
    addEvent('▶️ Iniciando Simulação Intermunicipal: Piaçabuçu ➔ Penedo...', 'warn');
  };

  const resetSimulation = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setAutoPlay(false);
    setSimStep('IDLE');
    setCurrentWaypointIndex(0);
    setPinEntered('');
    setRatingSubmitted(false);
    addEvent('🔄 Simulação reiniciada para estado inicial.', 'info');
  };

  // State Machine Progression Engine
  useEffect(() => {
    if (!autoPlay) return;

    if (simStep === 'AUTHENTICATING') {
      timerRef.current = setTimeout(() => {
        addEvent('✅ Mariana Silva autenticada com sucesso (Passageiro)', 'success');
        setSimStep('QUOTING');
      }, 1000);
    } else if (simStep === 'QUOTING') {
      timerRef.current = setTimeout(() => {
        addEvent('📊 Cotação calculada: 28.4 km via AL-101 / AL-225 • R$ 38,50 (Comfort)', 'info');
        setSimStep('REQUESTING');
      }, 1200);
    } else if (simStep === 'REQUESTING') {
      timerRef.current = setTimeout(() => {
        addEvent('📲 Solicitação de corrida enviada para a API', 'api');
        setSimStep('SEARCHING');
      }, 1000);
    } else if (simStep === 'SEARCHING') {
      timerRef.current = setTimeout(() => {
        addEvent('📡 Algoritmo Haversine: Motorista mais próximo localizado a 1.8 km', 'info');
        setSimStep('OFFER_SENT');
      }, 1500);
    } else if (simStep === 'OFFER_SENT') {
      timerRef.current = setTimeout(() => {
        addEvent('🔔 Oferta despachada para o cockpit do motorista Carlos Oliveira (25s countdown)', 'warn');
        // Auto-accept in simulation
        setTimeout(() => {
          setSimStep('ACCEPTED');
          addEvent('🤝 Carlos Oliveira ACEITOU a solicitação!', 'success');
        }, 1200);
      }, 800);
    } else if (simStep === 'ACCEPTED') {
      timerRef.current = setTimeout(() => {
        addEvent('🚗 Motorista a caminho do ponto de embarque na Praça São Francisco (Piaçabuçu)', 'info');
        setSimStep('DRIVER_ARRIVING');
      }, 1500);
    } else if (simStep === 'DRIVER_ARRIVING') {
      timerRef.current = setTimeout(() => {
        addEvent('📍 Carlos Oliveira CHEGOU ao ponto de embarque! Aguardando passageiro.', 'success');
        setSimStep('DRIVER_ARRIVED');
      }, 2000);
    } else if (simStep === 'DRIVER_ARRIVED') {
      timerRef.current = setTimeout(() => {
        setPinEntered(pinCode);
        addEvent(`🔐 Validação de Segurança: PIN de embarque digitado (${pinCode})`, 'warn');
        setTimeout(() => {
          addEvent('🚀 PIN validado! Corrida iniciada rumo a Penedo.', 'success');
          setSimStep('IN_PROGRESS');
        }, 1000);
      }, 1800);
    } else if (simStep === 'IN_PROGRESS') {
      // Advance along waypoints
      const interval = setInterval(() => {
        setCurrentWaypointIndex((prev) => {
          const next = prev + 1;
          if (next < ALAGOAS_ROUTE.length) {
            addEvent(`🛣️ Telemetria GPS: ${ALAGOAS_ROUTE[next].label} (${ALAGOAS_ROUTE[next].pct}%)`, 'api');
            return next;
          } else {
            clearInterval(interval);
            addEvent('🏁 Chegada ao destino: Largo de São Gonçalo, Centro Histórico de Penedo!', 'success');
            setSimStep('COMPLETED');
            return prev;
          }
        });
      }, 2000);
      return () => clearInterval(interval);
    } else if (simStep === 'COMPLETED') {
      timerRef.current = setTimeout(() => {
        addEvent('💳 Pagamento de R$ 38,50 aprovado e liquidado com sucesso.', 'success');
        addEvent('⭐ Mariana avaliou a viagem com 5 estrelas: "Viagem tranquila até Penedo!"', 'info');
        setRatingSubmitted(true);
        setSimStep('RATED');
        setAutoPlay(false);
      }, 2000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [simStep, autoPlay]);

  const currentWp = ALAGOAS_ROUTE[currentWaypointIndex];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Studio Header */}
      <div className="bg-[#123D32] rounded-3xl p-6 text-white border border-[#16A572]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#FFCC45] text-[#123D32] font-black text-xs uppercase tracking-wider">
              SIMBORA STUDIO
            </span>
            <span className="text-xs text-[#16A572] font-bold">
              Simulador E2E Multi-Plataforma
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Cenário Alagoas: Piaçabuçu ➔ Penedo
          </h1>
          <p className="text-xs md:text-sm text-slate-200">
            Validação simultânea do aplicativo do Passageiro, aplicativo do Motorista, telemetria GPS e despacho geoespacial.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={startFullSimulation}
            disabled={autoPlay}
            className={`px-6 py-4 rounded-2xl font-black text-sm shadow-lg transition flex items-center gap-2 cursor-pointer ${
              autoPlay
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#FFCC45] to-[#F59E0B] text-[#123D32] hover:brightness-105 transform hover:-translate-y-0.5'
            }`}
          >
            <span className="text-lg">▶️</span>
            <span>TESTAR PIAÇABUÇU ➔ PENEDO</span>
          </button>

          <button
            onClick={resetSimulation}
            className="px-4 py-4 rounded-2xl bg-[#0E2922] border border-[#16A572]/40 hover:bg-[#1A5243] text-slate-200 font-bold text-sm transition cursor-pointer"
          >
            Resetar
          </button>

          <a
            href="http://localhost:8080"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-4 rounded-2xl bg-[#16A572] hover:bg-[#139063] text-white font-black text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <span>🗺️</span>
            <span>SIMBORA Studio MapTiler (8080)</span>
          </a>
        </div>
      </div>

      {/* Corridor Metrics HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <p className="text-[11px] font-extrabold text-[#123D32] uppercase">Distância da Rota</p>
          <p className="text-2xl font-black text-[#17211D] mt-1">28.4 km</p>
          <p className="text-[11px] text-slate-500 font-semibold">Rodovias AL-101 / AL-225</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <p className="text-[11px] font-extrabold text-[#123D32] uppercase">Tempo Estimado (ETA)</p>
          <p className="text-2xl font-black text-[#16A572] mt-1">~28 min</p>
          <p className="text-[11px] text-slate-500 font-semibold">Trânsito livre no litoral sul</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <p className="text-[11px] font-extrabold text-[#123D32] uppercase">Tarifa Categoria Comfort</p>
          <p className="text-2xl font-black text-[#FFCC45] mt-1 text-[#B45309]">R$ {fare.toFixed(2)}</p>
          <p className="text-[11px] text-emerald-600 font-semibold">Taxa mínima intermunicipal</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <p className="text-[11px] font-extrabold text-[#123D32] uppercase">Estado da Simulação</p>
          <p className="text-lg font-black text-[#123D32] mt-1 uppercase tracking-wider truncate">
            {simStep}
          </p>
          <p className="text-[11px] text-[#16A572] font-bold">
            Progresso: {currentWp.pct}%
          </p>
        </div>
      </div>

      {/* Main Dual App Synchronized Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* PHONE 1: PASSAGEIRO (React Native Mockup) */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="w-full max-w-[340px] bg-[#123D32] rounded-[44px] p-3 shadow-2xl border-4 border-[#16A572]/40 relative">
            {/* Phone Speaker Notch */}
            <div className="w-32 h-4 bg-[#0E2922] mx-auto rounded-full mb-2 flex items-center justify-center">
              <div className="w-10 h-1 bg-[#284238] rounded-full"></div>
            </div>

            {/* Phone Screen Canvas */}
            <div className="bg-[#F8F9F6] rounded-[34px] h-[610px] overflow-hidden flex flex-col justify-between text-[#17211D] relative shadow-inner">
              {/* Status Bar */}
              <div className="px-5 py-2 flex justify-between items-center text-[10px] font-bold text-slate-600 bg-white/70 backdrop-blur-xs">
                <span>09:41</span>
                <span className="font-extrabold text-[#123D32]">SIMBORA 5G</span>
                <span>100% 🔋</span>
              </div>

              {/* App Screen Content depending on step */}
              <div className="flex-1 flex flex-col p-4 overflow-y-auto">
                {/* Header with Simbora Logo */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#123D32] flex items-center justify-center">
                      <span className="text-xs font-black text-[#FFCC45]">S</span>
                    </div>
                    <span className="font-black text-sm tracking-wider text-[#123D32]">SIMBORA</span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#DCFCE7] text-[#166534] px-2 py-0.5 rounded-full">
                    Mariana Silva
                  </span>
                </div>

                {/* Map Mini View inside Passenger App */}
                <div className="my-3 h-44 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 border border-emerald-200 relative overflow-hidden flex items-center justify-center">
                  {/* Decorative River Curve */}
                  <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 200 120">
                    <path d="M 0 40 Q 100 10 200 80" fill="none" stroke="#16A572" strokeWidth="8"/>
                  </svg>

                  {/* Dynamic Route Waypoints */}
                  <div className="absolute left-6 top-8 text-center">
                    <div className="w-5 h-5 rounded-full bg-[#16A572] border-2 border-white flex items-center justify-center text-[8px] font-bold text-white shadow">
                      P
                    </div>
                    <span className="text-[8px] font-bold text-[#123D32] mt-0.5 block">Piaçabuçu</span>
                  </div>

                  <div className="absolute right-6 bottom-8 text-center">
                    <div className="w-5 h-5 rounded-full bg-[#FFCC45] border-2 border-[#123D32] flex items-center justify-center text-[8px] font-bold text-[#123D32] shadow">
                      P
                    </div>
                    <span className="text-[8px] font-bold text-[#123D32] mt-0.5 block">Penedo</span>
                  </div>

                  {/* Pulsing Car Icon along path */}
                  <div
                    className="absolute transition-all duration-1000 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${15 + (currentWp.pct * 0.7)}%`,
                      top: `${30 + (currentWp.pct * 0.4)}%`,
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#123D32] border-2 border-[#FFCC45] flex items-center justify-center shadow-lg text-xs animate-bounce">
                      🚗
                    </div>
                  </div>

                  {/* Radar Pulse when Searching */}
                  {simStep === 'SEARCHING' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#123D32]/40 backdrop-blur-2xs">
                      <div className="w-16 h-16 rounded-full border-4 border-[#FFCC45] animate-ping"></div>
                      <span className="absolute text-[10px] font-black text-white bg-[#123D32] px-2 py-1 rounded-full shadow">
                        Buscando Motorista...
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Card Area */}
                <div className="space-y-2 flex-1">
                  {simStep === 'IDLE' && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-2">
                      <p className="text-xs font-bold text-[#123D32]">Pra onde vamos hoje em Alagoas?</p>
                      <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg text-left">
                        <p className="font-semibold text-slate-700">🟢 Origem: Praça São Francisco, Piaçabuçu</p>
                        <p className="font-semibold text-slate-700 mt-1">🏁 Destino: Largo São Gonçalo, Penedo</p>
                      </div>
                      <button
                        onClick={startFullSimulation}
                        className="w-full py-2.5 rounded-xl bg-[#16A572] text-white text-xs font-bold hover:bg-[#138e62]"
                      >
                        Pedir Simbora
                      </button>
                    </div>
                  )}

                  {simStep === 'SEARCHING' && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-1">
                      <p className="text-xs font-extrabold text-amber-900">Localizando motorista mais próximo...</p>
                      <p className="text-[10px] text-amber-700">Verificando frota ativa na AL-101 Sul</p>
                    </div>
                  )}

                  {(simStep === 'ACCEPTED' || simStep === 'DRIVER_ARRIVING' || simStep === 'DRIVER_ARRIVED' || simStep === 'IN_PROGRESS') && (
                    <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-[#123D32] text-white flex items-center justify-center font-bold text-xs">
                            CO
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#17211D]">Carlos Oliveira</p>
                            <p className="text-[10px] text-slate-500">Toyota Corolla Hybrid • BRA2E19</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-md">
                          ⭐ 4.95
                        </span>
                      </div>

                      {/* Security PIN Display */}
                      <div className="p-2.5 rounded-xl bg-[#123D32] text-white flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-bold text-[#16A572] uppercase">PIN DE EMBARQUE</p>
                          <p className="text-lg font-mono font-black text-[#FFCC45] tracking-widest">{pinCode}</p>
                        </div>
                        <span className="text-[10px] text-slate-300 max-w-[120px] text-right">
                          Informe ao motorista ao entrar no carro
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded-lg flex justify-between items-center">
                        <span>Status: <b>{simStep.replace('_', ' ')}</b></span>
                        <span className="font-bold text-[#16A572]">R$ {fare.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  {simStep === 'COMPLETED' && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                      <span className="text-2xl">🎉</span>
                      <p className="text-sm font-black text-emerald-900">Você chegou a Penedo!</p>
                      <p className="text-xs text-emerald-700">Valor total pago: <b>R$ {fare.toFixed(2)}</b></p>
                      <p className="text-[11px] text-slate-500">Avalie sua experiência:</p>
                      <div className="flex justify-center gap-1 text-lg">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className="text-[#FFCC45]">⭐</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {simStep === 'RATED' && (
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center space-y-2">
                      <span className="text-2xl">✅</span>
                      <p className="text-xs font-bold text-[#123D32]">Obrigado por viajar com a SIMBORA!</p>
                      <p className="text-[10px] text-slate-500">Pediu. Chegou. Simbora!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Nav Bar */}
              <div className="px-6 py-2.5 bg-white border-t border-slate-200 flex justify-between text-[11px] font-bold text-slate-400">
                <span className="text-[#16A572]">Início</span>
                <span>Atividades</span>
                <span>Conta</span>
              </div>
            </div>
          </div>
          <span className="mt-3 text-xs font-black text-[#123D32] uppercase tracking-wider">
            App do Passageiro (Mariana)
          </span>
        </div>

        {/* MAP & EVENT LOG CENTRAL AREA */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Interactive Geographic Map Alagoas */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-black text-[#123D32] flex items-center gap-2">
                <span>🗺️</span>
                <span>Corredor Rodoviário AL-101 / AL-225</span>
              </h2>
              <span className="text-[10px] font-extrabold bg-[#DCFCE7] text-[#166534] px-2 py-0.5 rounded-full">
                GPS ATIVO (3s)
              </span>
            </div>

            {/* Custom Alagoas Map Canvas SVG */}
            <div className="h-56 w-full rounded-2xl bg-[#0E2922] p-2 relative overflow-hidden border border-[#16A572]/30">
              <svg viewBox="0 0 400 240" className="w-full h-full">
                {/* Background Land Surface */}
                <rect width="400" height="240" fill="#123D32"/>

                {/* Rio São Francisco Flow Waterway */}
                <path
                  d="M -20 180 C 80 160 160 210 260 170 C 320 150 360 190 420 180 L 420 240 L -20 240 Z"
                  fill="#0E2922"
                  opacity="0.8"
                />
                <text x="140" y="215" fill="#16A572" opacity="0.4" fontSize="10" fontWeight="bold">
                  Rio São Francisco (O Velho Chico)
                </text>

                {/* Highway AL-101 / AL-225 Path */}
                <path
                  d="M 60 150 Q 160 110 240 130 T 340 70"
                  fill="none"
                  stroke="#284238"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 60 150 Q 160 110 240 130 T 340 70"
                  fill="none"
                  stroke="#16A572"
                  strokeWidth="4"
                  strokeDasharray="6,4"
                  strokeLinecap="round"
                />

                {/* Piaçabuçu Origin Point */}
                <circle cx="60" cy="150" r="8" fill="#16A572" stroke="#FFFFFF" strokeWidth="2"/>
                <text x="60" y="172" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                  Piaçabuçu
                </text>

                {/* Penedo Destination Point */}
                <circle cx="340" cy="70" r="8" fill="#FFCC45" stroke="#123D32" strokeWidth="2"/>
                <text x="340" y="92" textAnchor="middle" fill="#FFCC45" fontSize="10" fontWeight="bold">
                  Penedo
                </text>

                {/* Live Vehicle Marker */}
                <g
                  transform={`translate(${60 + ((340 - 60) * (currentWp.pct / 100))}, ${
                    150 + ((70 - 150) * (currentWp.pct / 100))
                  })`}
                  className="transition-all duration-1000"
                >
                  <circle cx="0" cy="0" r="14" fill="#FFCC45" opacity="0.3" className="animate-ping"/>
                  <circle cx="0" cy="0" r="10" fill="#17211D" stroke="#FFCC45" strokeWidth="2"/>
                  <text x="0" y="4" textAnchor="middle" fontSize="10">🚗</text>
                </g>
              </svg>
            </div>

            {/* Current Waypoint Telemetry Info */}
            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-extrabold text-[#123D32]">📍 Posição Atual do Veículo:</p>
              <p className="text-slate-700 font-semibold">{currentWp.label}</p>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Lat: {currentWp.lat.toFixed(4)}</span>
                <span>Lng: {currentWp.lng.toFixed(4)}</span>
                <span className="font-bold text-[#16A572]">{currentWp.pct}% do trajeto</span>
              </div>
            </div>
          </div>

          {/* Real-Time Event Log */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 shadow-xs flex-1 flex flex-col">
            <h2 className="text-xs font-black text-[#123D32] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Histórico de Eventos da Corrida</span>
              <span className="text-[10px] text-slate-400 font-normal">{events.length} registros</span>
            </h2>

            <div className="space-y-1.5 overflow-y-auto max-h-[220px] text-[11px] font-mono pr-1">
              {events.map((ev, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg border ${
                    ev.type === 'success'
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                      : ev.type === 'warn'
                      ? 'bg-amber-50/60 border-amber-200 text-amber-800'
                      : ev.type === 'api'
                      ? 'bg-blue-50/60 border-blue-200 text-blue-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="text-[9px] font-bold opacity-60 mr-1.5">{ev.time}</span>
                  <span>{ev.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PHONE 2: MOTORISTA (React Native Cockpit Mockup) */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="w-full max-w-[340px] bg-[#0E1412] rounded-[44px] p-3 shadow-2xl border-4 border-[#FFCC45]/40 relative">
            {/* Phone Speaker Notch */}
            <div className="w-32 h-4 bg-[#17211D] mx-auto rounded-full mb-2 flex items-center justify-center">
              <div className="w-10 h-1 bg-[#284238] rounded-full"></div>
            </div>

            {/* Phone Screen Canvas (Dark Cockpit Theme) */}
            <div className="bg-[#17211D] rounded-[34px] h-[610px] overflow-hidden flex flex-col justify-between text-white relative shadow-inner">
              {/* Status Bar */}
              <div className="px-5 py-2 flex justify-between items-center text-[10px] font-bold text-slate-400 bg-[#0E1412]/80">
                <span>09:41</span>
                <span className="font-extrabold text-[#FFCC45]">SIMBORA MOTORISTA</span>
                <span>98% ⚡</span>
              </div>

              {/* Driver Screen Body */}
              <div className="flex-1 flex flex-col p-4 overflow-y-auto">
                {/* Driver Top Header & Online Toggle */}
                <div className="flex items-center justify-between pb-3 border-b border-[#284238]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#FFCC45] text-[#123D32] flex items-center justify-center font-black text-xs">
                      M
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Carlos Oliveira</p>
                      <p className="text-[9px] text-[#16A572]">Corolla Hybrid • BRA2E19</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setDriverOnline(!driverOnline)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black transition ${
                      driverOnline
                        ? 'bg-[#16A572] text-white shadow-xs'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {driverOnline ? 'ONLINE' : 'OFFLINE'}
                  </button>
                </div>

                {/* Earnings Mini HUD */}
                <div className="my-3 p-3 rounded-2xl bg-[#1E2E28] border border-[#284238] flex justify-between items-center">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Ganhos de Hoje</p>
                    <p className="text-xl font-black text-[#FFCC45]">R$ 142,50</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-extrabold bg-[#123D32] text-[#16A572] px-2 py-0.5 rounded-full border border-[#16A572]/40">
                      5 Corridas
                    </span>
                  </div>
                </div>

                {/* Dynamic Driver Cockpit Views */}
                <div className="flex-1 flex flex-col justify-center space-y-3">
                  {simStep === 'IDLE' && (
                    <div className="text-center p-6 space-y-2">
                      <div className="w-16 h-16 rounded-full bg-[#123D32] border border-[#16A572] mx-auto flex items-center justify-center text-2xl">
                        📡
                      </div>
                      <p className="text-xs font-bold text-slate-200">Você está online</p>
                      <p className="text-[10px] text-slate-400">
                        Aguardando novas chamadas no trecho Piaçabuçu ⇄ Penedo
                      </p>
                    </div>
                  )}

                  {/* Incoming Ride Offer Modal (25s) */}
                  {simStep === 'OFFER_SENT' && (
                    <div className="p-4 rounded-2xl bg-[#1E2E28] border-2 border-[#FFCC45] space-y-3 animate-pulse">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black bg-[#FFCC45] text-[#123D32] px-2 py-0.5 rounded">
                          NOVA CORRIDA (25s)
                        </span>
                        <span className="text-lg font-black text-[#FFCC45]">R$ {fare.toFixed(2)}</span>
                      </div>

                      <div className="text-[11px] text-slate-200 space-y-1">
                        <p>👤 Mariana Silva (⭐ 4.9)</p>
                        <p className="text-[#16A572]">🟢 Embarque: Praça São Francisco (1.2 km)</p>
                        <p className="text-[#FFCC45]">🏁 Destino: Centro Histórico, Penedo (28 km)</p>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => setSimStep('ACCEPTED')}
                          className="flex-1 py-3 rounded-xl bg-[#16A572] hover:bg-[#138e62] font-black text-xs text-white"
                        >
                          ACEITAR
                        </button>
                        <button
                          onClick={() => setSimStep('IDLE')}
                          className="px-3 py-3 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold"
                        >
                          Recusar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Navigation HUD while En Route to Passenger */}
                  {simStep === 'ACCEPTED' && (
                    <div className="p-4 rounded-2xl bg-[#1E2E28] border border-[#284238] space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl text-[#FFCC45]">↱</span>
                        <div>
                          <p className="text-xs font-bold text-white">Em 200m vire à direita</p>
                          <p className="text-[10px] text-slate-400">Rumo à Praça São Francisco</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSimStep('DRIVER_ARRIVING')}
                        className="w-full py-2.5 rounded-xl bg-[#16A572] font-black text-xs text-white"
                      >
                        A CAMINHO DO EMBARQUE
                      </button>
                    </div>
                  )}

                  {simStep === 'DRIVER_ARRIVING' && (
                    <div className="p-4 rounded-2xl bg-[#1E2E28] border border-[#284238] space-y-3">
                      <p className="text-xs font-bold text-[#FFCC45] text-center">Você está a 50m do passageiro</p>
                      <button
                        onClick={() => setSimStep('DRIVER_ARRIVED')}
                        className="w-full py-3 rounded-xl bg-[#FFCC45] text-[#123D32] font-black text-xs"
                      >
                        CHEGUEI AO LOCAL DE EMBARQUE
                      </button>
                    </div>
                  )}

                  {/* PIN Verification Input */}
                  {simStep === 'DRIVER_ARRIVED' && (
                    <div className="p-4 rounded-2xl bg-[#1E2E28] border border-[#16A572] space-y-2.5">
                      <p className="text-xs font-black text-[#16A572] text-center">SOLICITE O PIN AO PASSAGEIRO</p>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="PIN (4 dígitos)"
                        value={pinEntered}
                        onChange={(e) => setPinEntered(e.target.value)}
                        className="w-full py-2.5 text-center text-xl font-mono font-black tracking-widest bg-[#17211D] border border-[#284238] rounded-xl text-[#FFCC45]"
                      />
                      <button
                        onClick={() => setSimStep('IN_PROGRESS')}
                        className="w-full py-3 rounded-xl bg-[#16A572] font-black text-xs text-white"
                      >
                        VALIDAR & INICIAR CORRIDA
                      </button>
                    </div>
                  )}

                  {/* Turn-by-Turn Navigation Screen */}
                  {simStep === 'IN_PROGRESS' && (
                    <div className="p-4 rounded-2xl bg-[#1E2E28] border border-[#284238] space-y-3">
                      <div className="p-3 bg-[#17211D] rounded-xl border border-[#284238] flex items-center gap-3">
                        <span className="text-2xl text-[#FFCC45]">⬆</span>
                        <div>
                          <p className="text-xs font-bold text-white">Siga pela AL-101 Sul / AL-225</p>
                          <p className="text-[10px] text-slate-400">Próxima saída para Penedo Centro</p>
                        </div>
                      </div>

                      <div className="flex justify-between text-xs text-slate-300 px-1">
                        <span>Velocidade: <b>78 km/h</b></span>
                        <span className="text-[#FFCC45]">Progresso: <b>{currentWp.pct}%</b></span>
                      </div>

                      <button
                        onClick={() => setSimStep('COMPLETED')}
                        className="w-full py-3 rounded-xl bg-emerald-600 font-black text-xs text-white"
                      >
                        FINALIZAR CORRIDA EM PENEDO
                      </button>
                    </div>
                  )}

                  {(simStep === 'COMPLETED' || simStep === 'RATED') && (
                    <div className="p-4 rounded-2xl bg-[#1E2E28] border border-emerald-500 text-center space-y-2">
                      <span className="text-2xl">💰</span>
                      <p className="text-xs font-black text-white">Corrida Concluída!</p>
                      <p className="text-lg font-black text-[#FFCC45]">+ R$ {(fare * 0.85).toFixed(2)}</p>
                      <p className="text-[10px] text-slate-400">Líquido adicionado aos seus ganhos diários</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Cockpit Bar */}
              <div className="px-6 py-2.5 bg-[#0E1412] border-t border-[#284238] flex justify-between text-[11px] font-bold text-slate-400">
                <span className="text-[#FFCC45]">Navegação</span>
                <span>Ganhos</span>
                <span>Perfil</span>
              </div>
            </div>
          </div>
          <span className="mt-3 text-xs font-black text-[#FFCC45] uppercase tracking-wider">
            App do Motorista (Carlos)
          </span>
        </div>
      </div>
    </div>
  );
}
