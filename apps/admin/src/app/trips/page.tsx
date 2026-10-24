'use client';

import React, { useEffect, useState } from 'react';

export default function TripsAdminPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetch('http://localhost:3001/trips')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTrips(data);
      })
      .catch((e) => console.log('Error fetching trips', e));
  }, []);

  const filteredTrips =
    filter === 'ALL'
      ? trips
      : trips.filter((t) => t.status?.toUpperCase() === filter);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#123D32] tracking-tight">
            Monitor de Corridas e Despacho — Alagoas
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Acompanhe o ciclo de vida completo de cada viagem no corredor Penedo ⇄ Piaçabuçu.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {['ALL', 'SEARCHING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(
            (s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filter === s
                    ? 'bg-[#16A572] text-white shadow-xs'
                    : 'bg-white border border-[#E2E8F0] text-slate-600 hover:bg-slate-50'
                }`}
              >
                {s}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F8F9F6] border-b border-[#E2E8F0] text-xs font-extrabold text-[#123D32] uppercase">
            <tr>
              <th className="px-6 py-4">ID Corrida</th>
              <th className="px-6 py-4">Passageiro</th>
              <th className="px-6 py-4">Origem / Destino</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Tarifa</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTrips.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                  Nenhuma corrida encontrada para o filtro selecionado.
                </td>
              </tr>
            ) : (
              filteredTrips.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">
                    {trip.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 font-bold text-[#17211D]">
                    {trip.passenger?.name || 'Mariana Silva'}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 space-y-1">
                    <p className="flex items-center gap-1 font-semibold text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-[#16A572]"></span>
                      {trip.originAddress || 'Piaçabuçu (Praça São Francisco)'}
                    </p>
                    <p className="flex items-center gap-1 font-semibold text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-[#FFCC45]"></span>
                      {trip.destAddress || 'Penedo (Centro Histórico)'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#DCFCE7] text-[#166534]">
                      {trip.category?.toUpperCase() || 'COMFORT'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-[#123D32]">
                    R$ {Number(trip.fare || 38.5).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        trip.status === 'COMPLETED'
                          ? 'bg-[#DCFCE7] text-[#166534]'
                          : trip.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800'
                          : trip.status === 'SEARCHING'
                          ? 'bg-[#FEF3C7] text-[#B45309]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {trip.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
