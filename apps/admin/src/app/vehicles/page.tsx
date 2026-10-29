'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function VehiclesAdminPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [search, setSearch] = useState('');
  const [inspectModal, setInspectModal] = useState<any | null>(null);
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('economy');

  const fetchVehicles = () => {
    setLoading(true);
    fetch('http://localhost:3001/vehicles')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setVehicles(data);
      })
      .catch((e) => console.log('Error vehicles', e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleOpenInspect = (vehicle: any) => {
    setInspectModal(vehicle);
    setInspectionNotes(vehicle.inspectionNotes || '');
    setSelectedCategory(vehicle.category || 'economy');
  };

  const handleUpdateApproval = async (approved: boolean) => {
    if (!inspectModal) return;
    try {
      await fetch(`http://localhost:3001/vehicles/${inspectModal.id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approved,
          notes: inspectionNotes.trim() || (approved ? 'Aprovado em vistoria presencial' : 'Reprovado em vistoria técnica'),
        }),
      });

      if (selectedCategory !== inspectModal.category) {
        await fetch(`http://localhost:3001/vehicles/${inspectModal.id}/category`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: selectedCategory }),
        });
      }

      setInspectModal(null);
      fetchVehicles();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    if (filter === 'pending' && v.approved) return false;
    if (filter === 'approved' && !v.approved) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchMake = v.make?.toLowerCase().includes(q);
      const matchModel = v.model?.toLowerCase().includes(q);
      const matchPlate = v.plateNumber?.toLowerCase().includes(q);
      const matchDriver = v.driver?.user?.name?.toLowerCase().includes(q);
      return matchMake || matchModel || matchPlate || matchDriver;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#123D32] tracking-tight">
            Vistoria & Homologação de Veículos — SIMBORA
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestão da frota, inspeção veicular, enquadramento de categoria e liberação no polo Alagoas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/vehicles/requests"
            className="px-4 py-2 bg-[#FFCC45] hover:bg-[#ffc526] text-[#123D32] text-xs font-black rounded-xl transition shadow-xs flex items-center gap-1.5"
          >
            <span>🔄 Solicitações de Troca</span>
          </Link>
          <button
            onClick={fetchVehicles}
            className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            ↻ Atualizar
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'all'
                ? 'bg-[#123D32] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({vehicles.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'pending'
                ? 'bg-[#B45309] text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Aguardando Vistoria ({vehicles.filter((v) => !v.approved).length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'approved'
                ? 'bg-[#16A572] text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Homologados ({vehicles.filter((v) => v.approved).length})
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar por placa, modelo ou motorista..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#16A572]"
        />
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F8F9F6] border-b border-[#E2E8F0] text-xs font-extrabold text-[#123D32] uppercase">
            <tr>
              <th className="px-6 py-4">Veículo</th>
              <th className="px-6 py-4">Placa / Renavam</th>
              <th className="px-6 py-4">Motorista Proprietário</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Status Vistoria</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                  Carregando frota de veículos...
                </td>
              </tr>
            ) : filteredVehicles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                  Nenhum veículo encontrado com os filtros selecionados.
                </td>
              </tr>
            ) : (
              filteredVehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#17211D]">
                      {v.make} {v.model}
                    </div>
                    <div className="text-xs text-slate-500">
                      Ano {v.year} • Cor: {v.color} • {v.seats || 4} assentos
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono">
                    <p className="font-extrabold text-slate-800">{v.plateNumber}</p>
                    <p className="text-slate-400">{v.renavam ? `Renavam: ${v.renavam}` : 'Renavam pendente'}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-700">
                    {v.driver?.user?.name ? (
                      <div>
                        <p className="font-bold text-[#123D32]">{v.driver.user.name}</p>
                        <p className="text-slate-500 font-mono text-[11px]">{v.driver.licenseNumber}</p>
                      </div>
                    ) : (
                      <span className="text-slate-400">Motorista ID: {v.driverId?.slice(0, 8)}...</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-extrabold uppercase ${
                        v.category === 'premium'
                          ? 'bg-purple-100 text-purple-700'
                          : v.category === 'comfort'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {v.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        v.approved
                          ? 'bg-[#DCFCE7] text-[#166534]'
                          : 'bg-[#FEF3C7] text-[#B45309]'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          v.approved ? 'bg-[#16A572]' : 'bg-[#FFCC45]'
                        }`}
                      ></span>
                      {v.approved ? 'HOMOLOGADO' : 'PENDENTE'}
                    </span>
                    {v.inspectionNotes && (
                      <p className="text-[11px] text-slate-500 mt-1 truncate max-w-xs">
                        {v.inspectionNotes}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleOpenInspect(v)}
                      className="px-3 py-1.5 rounded-lg bg-[#123D32] hover:bg-[#0E2922] text-white text-xs font-bold transition shadow-xs"
                    >
                      Vistoria / Ajustes
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Inspection Modal */}
      {inspectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div>
                <h3 className="text-lg font-black text-[#123D32]">
                  Vistoria Técnica do Veículo
                </h3>
                <p className="text-xs text-slate-500">
                  {inspectModal.make} {inspectModal.model} ({inspectModal.year}) • Placa: {inspectModal.plateNumber}
                </p>
              </div>
              <button
                onClick={() => setInspectModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Classificação da Categoria:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['economy', 'comfort', 'premium'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`py-2 rounded-xl font-bold uppercase transition text-xs border ${
                        selectedCategory === cat
                          ? 'bg-[#123D32] text-[#FFCC45] border-[#123D32]'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Parecer / Notas da Vistoria:
                </label>
                <textarea
                  rows={3}
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  placeholder="Ex: Veículo em excelente estado de conservação, ar condicionado funcionando perfeitamente, pneus novos."
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#16A572]"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <p className="text-slate-600">
                  <span className="font-bold">Motorista:</span> {inspectModal.driver?.user?.name || inspectModal.driverId}
                </p>
                <p className="text-slate-600">
                  <span className="font-bold">Cor:</span> {inspectModal.color} • <span className="font-bold">Assentos:</span> {inspectModal.seats || 4}
                </p>
                <p className="text-slate-600">
                  <span className="font-bold">Renavam:</span> {inspectModal.renavam || 'Não informado'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t">
              <button
                onClick={() => setInspectModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleUpdateApproval(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 transition border border-rose-200"
              >
                Reprovar / Pendenciar
              </button>
              <button
                onClick={() => handleUpdateApproval(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#16A572] hover:bg-[#138e62] text-white transition shadow-sm"
              >
                Homologar & Aprovar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
