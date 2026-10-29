'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function VehicleChangeRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [search, setSearch] = useState('');
  
  // Modals
  const [approveModal, setApproveModal] = useState<any | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  
  const [rejectModal, setRejectModal] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // First try to authenticate as admin to get token
      let token = typeof window !== 'undefined' ? localStorage.getItem('simbora_admin_token') : null;
      if (!token) {
        try {
          const authRes = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: 'admin@mobility.com', password: 'Password@123' }),
          });
          if (authRes.ok) {
            const authData = await authRes.json();
            token = authData.accessToken;
            if (token && typeof window !== 'undefined') {
              localStorage.setItem('simbora_admin_token', token);
            }
          }
        } catch (e) {
          console.warn('Auto-admin login error', e);
        }
      }

      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('http://localhost:3001/vehicles/change-requests', { headers });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setRequests(data);
          return;
        }
      }

      // Demo fallback if backend is unreachable or empty
      setRequests([
        {
          id: 'demo-req-01',
          driverId: 'drv-carlos-01',
          driver: { user: { name: 'Carlos Oliveira', email: 'carlos.oliveira@simbora.al', phone: '+55 82 99876-1234' } },
          currentVehicle: {
            make: 'Toyota',
            model: 'Corolla XEi 2.0',
            year: 2022,
            plateNumber: 'QTT-4821',
            color: 'Prata Lunar',
            category: 'comfort',
          },
          requestedMake: 'Toyota',
          requestedModel: 'Corolla Cross XRE 2.0',
          requestedYear: 2024,
          requestedPlate: 'SIM-3400',
          requestedColor: 'Branco Pérola',
          requestedCategory: 'comfort',
          requestedSeats: 5,
          reason: 'Renovação de frota para SUV homologado na categoria Conforto & Pop SIMBORA Alagoas.',
          notes: 'Veículo 0km adquirido na concessionária de Maceió, laudo de vistoria anexado.',
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (e) {
      console.error('Error fetching requests', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async () => {
    if (!approveModal) return;
    setSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('simbora_admin_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`http://localhost:3001/vehicles/change-requests/${approveModal.id}/approve`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ notes: approvalNotes || 'Aprovado via homologação técnica SIMBORA Alagoas' }),
      });

      if (res.ok) {
        setApproveModal(null);
        setApprovalNotes('');
        await fetchRequests();
      } else {
        const err = await res.json();
        alert(`Erro ao aprovar: ${err.message || 'Falha na requisição'}`);
      }
    } catch (e: any) {
      alert(`Erro: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    if (!rejectionReason.trim()) {
      alert('A justificativa de reprovação é obrigatória.');
      return;
    }
    setSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('simbora_admin_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`http://localhost:3001/vehicles/change-requests/${rejectModal.id}/reject`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ rejectionReason: rejectionReason.trim() }),
      });

      if (res.ok) {
        setRejectModal(null);
        setRejectionReason('');
        await fetchRequests();
      } else {
        const err = await res.json();
        alert(`Erro ao reprovar: ${err.message || 'Falha na requisição'}`);
      }
    } catch (e: any) {
      alert(`Erro: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filter !== 'ALL' && r.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchDriver = r.driver?.user?.name?.toLowerCase().includes(q);
      const matchPlate = r.requestedPlate?.toLowerCase().includes(q);
      const matchMake = r.requestedMake?.toLowerCase().includes(q);
      const matchModel = r.requestedModel?.toLowerCase().includes(q);
      return matchDriver || matchPlate || matchMake || matchModel;
    }
    return true;
  });

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/vehicles"
              className="text-xs font-bold text-slate-500 hover:text-[#16A572] transition"
            >
              ← Frota de Veículos
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-[#16A572]">Solicitações de Alteração</span>
          </div>
          <h1 className="text-2xl font-black text-[#123D32] tracking-tight mt-1">
            Homologação de Troca de Veículos — SIMBORA 3.4
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Fluxo regulatório para análise e aprovação de novos veículos solicitados pelos motoristas parceiros.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/vehicles"
            className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            Ver Frota Ativa
          </Link>
          <button
            onClick={fetchRequests}
            className="px-4 py-2 bg-[#123D32] hover:bg-[#0E2922] text-white text-xs font-bold rounded-xl transition shadow-sm"
          >
            ↻ Atualizar
          </button>
        </div>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filter === 'ALL'
                ? 'bg-[#123D32] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas ({requests.length})
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              filter === 'PENDING'
                ? 'bg-[#FFCC45] text-[#123D32]'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <span>Pendentes</span>
            {pendingCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#123D32] text-white text-[10px] flex items-center justify-center font-black">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('APPROVED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filter === 'APPROVED'
                ? 'bg-[#16A572] text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            Aprovadas
          </button>
          <button
            onClick={() => setFilter('REJECTED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filter === 'REJECTED'
                ? 'bg-[#FF334E] text-white'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            Rejeitadas
          </button>
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Buscar por motorista, placa ou modelo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#16A572]"
          />
        </div>
      </div>

      {/* Main Request Cards List */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-[#E2E8F0] text-center text-slate-400">
          Carregando solicitações de alteração veicular...
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-[#E2E8F0] text-center space-y-2">
          <span className="text-3xl block">📋</span>
          <h3 className="font-bold text-slate-700">Nenhuma solicitação encontrada</h3>
          <p className="text-xs text-slate-400">Não há registros correspondentes aos filtros selecionados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const isPending = req.status === 'PENDING' || req.status === 'IN_REVIEW';
            const isApproved = req.status === 'APPROVED';
            const isRejected = req.status === 'REJECTED';

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition p-5 space-y-4"
              >
                {/* Header: Driver info & Request status */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#123D32] text-[#00FF9C] flex items-center justify-center font-black text-sm">
                      {req.driver?.user?.name ? req.driver.user.name.charAt(0) : 'M'}
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-[#123D32]">
                        {req.driver?.user?.name || 'Motorista Parceiro'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {req.driver?.user?.phone || 'Telefone não informado'} • {req.driver?.user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(req.createdAt).toLocaleString('pt-BR')}
                    </span>
                    {isPending && (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FFCC45]/20 text-[#123D32] border border-[#FFCC45] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#FFCC45] animate-ping"></span>
                        PENDENTE DE AVALIAÇÃO
                      </span>
                    )}
                    {isApproved && (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ✓ APROVADO & ATIVO
                      </span>
                    )}
                    {isRejected && (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">
                        ✕ REJEITADO
                      </span>
                    )}
                  </div>
                </div>

                {/* Side-by-Side Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Current Vehicle */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        Veículo Atual
                      </span>
                      <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                        Em Operação
                      </span>
                    </div>

                    {req.currentVehicle ? (
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Modelo:</span>
                          <span className="font-bold text-slate-800">
                            {req.currentVehicle.make} {req.currentVehicle.model}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Ano:</span>
                          <span className="font-bold text-slate-800">{req.currentVehicle.year}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Placa:</span>
                          <span className="font-mono font-bold text-slate-800">
                            {req.currentVehicle.plateNumber}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Cor:</span>
                          <span className="font-bold text-slate-800">{req.currentVehicle.color}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Categoria:</span>
                          <span className="font-bold text-[#16A572] uppercase">
                            {req.currentVehicle.category}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic py-3 text-center">
                        Primeiro veículo (motorista sem veículo ativo cadastrado)
                      </p>
                    )}
                  </div>

                  {/* Requested Vehicle */}
                  <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200 space-y-2 relative">
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                      <span className="text-[10px] uppercase font-black text-[#123D32] tracking-wider">
                        Novo Veículo Solicitado
                      </span>
                      <span className="text-xs font-black text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded">
                        Sob Análise
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Modelo:</span>
                        <span className="font-black text-[#123D32]">
                          {req.requestedMake} {req.requestedModel}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Ano de Fabricação:</span>
                        <span className="font-black text-[#123D32]">{req.requestedYear}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Nova Placa:</span>
                        <span className="font-mono font-black text-[#123D32] bg-white px-2 py-0.5 rounded border border-emerald-300">
                          {req.requestedPlate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Cor Oficial:</span>
                        <span className="font-bold text-slate-800">{req.requestedColor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Categoria Solicitada:</span>
                        <span className="font-black text-[#16A572] uppercase">
                          {req.requestedCategory}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Justification & Notes */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    Motivo declarado pelo motorista:
                  </span>
                  <p className="text-slate-800 font-medium">{req.reason}</p>
                  {req.notes && (
                    <p className="text-slate-500 text-[11px] pt-1 border-t border-slate-200">
                      <b>Obs:</b> {req.notes}
                    </p>
                  )}
                  {isRejected && req.rejectionReason && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 mt-2">
                      <span className="font-bold block text-[10px] uppercase">Motivo da Reprovação:</span>
                      <p className="text-xs">{req.rejectionReason}</p>
                    </div>
                  )}
                </div>

                {/* Actions Bar */}
                {isPending && (
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => setRejectModal(req)}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-[#FF334E] border border-rose-200 rounded-xl text-xs font-black transition"
                    >
                      ✕ REJEITAR ALTERAÇÃO
                    </button>
                    <button
                      onClick={() => setApproveModal(req)}
                      className="px-5 py-2 bg-[#16A572] hover:bg-[#139063] text-[#123D32] rounded-xl text-xs font-black transition shadow-sm hover:shadow"
                    >
                      ✓ APROVAR ALTERAÇÃO
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* APPROVE MODAL */}
      {approveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-black text-[#123D32]">
              Confirmar Aprovação de Alteração Veicular
            </h3>
            <p className="text-xs text-slate-600">
              Ao confirmar, o veículo <b>{approveModal.requestedMake} {approveModal.requestedModel} ({approveModal.requestedPlate})</b> será definido como o veículo oficial e ativo do motorista <b>{approveModal.driver?.user?.name}</b>.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Parecer da Vistoria / Notas Internas:
              </label>
              <textarea
                rows={3}
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Ex: Veículo vistoriado e homologado com documentação CRLV 2026 conferida no polo Penedo."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#16A572]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                disabled={submitting}
                onClick={() => setApproveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancelar
              </button>
              <button
                disabled={submitting}
                onClick={handleApprove}
                className="px-5 py-2 rounded-xl text-xs font-black bg-[#16A572] text-[#123D32] hover:bg-[#139063] transition shadow-sm"
              >
                {submitting ? 'Aprovando...' : 'Confirmar e Efetivar Veículo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-black text-[#FF334E]">
              Reprovar Solicitação de Alteração
            </h3>
            <p className="text-xs text-slate-600">
              Informe a justificativa oficial. O motorista <b>{rejectModal.driver?.user?.name}</b> receberá esta notificação no aplicativo e seu veículo atual continuará inalterado.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Justificativa Obrigatória: *
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Ex: Ano de fabricação do veículo não atende ao regulamento da categoria Conforto ou divergência na documentação CRLV."
                className="w-full text-xs p-3 rounded-xl border border-rose-300 focus:outline-none focus:border-[#FF334E]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                disabled={submitting}
                onClick={() => setRejectModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancelar
              </button>
              <button
                disabled={submitting}
                onClick={handleReject}
                className="px-5 py-2 rounded-xl text-xs font-black bg-[#FF334E] text-white hover:bg-rose-700 transition shadow-sm"
              >
                {submitting ? 'Reprovando...' : 'Confirmar Reprovação'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
