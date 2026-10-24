'use client';

import React, { useEffect, useState } from 'react';

export default function DriversAdminPage() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);
  const [driverDocs, setDriverDocs] = useState<any[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [reviewNote, setReviewNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const fetchDrivers = () => {
    setLoading(true);
    fetch('http://localhost:3001/drivers')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDrivers(data);
      })
      .catch((e) => console.log('Error drivers', e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleOpenDocs = async (driver: any) => {
    setSelectedDriver(driver);
    setDocsLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/documents/driver/${driver.id}`);
      const data = await res.json();
      setDriverDocs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setDriverDocs([]);
    } finally {
      setDocsLoading(false);
    }
  };

  const handleReviewDoc = async (docId: string, status: 'approved' | 'rejected') => {
    try {
      await fetch(`http://localhost:3001/documents/${docId}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          reviewNotes: reviewNote.trim() || (status === 'approved' ? 'Validado pela equipe SIMBORA' : 'Documento ilegível ou inválido'),
        }),
      });
      setReviewNote('');
      if (selectedDriver) {
        handleOpenDocs(selectedDriver);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApproveDriver = async (driverId: string) => {
    await fetch(`http://localhost:3001/admin/drivers/${driverId}/approve`, {
      method: 'PUT',
    });
    fetchDrivers();
    if (selectedDriver?.id === driverId) {
      setSelectedDriver(null);
    }
  };

  const handleRejectDriver = async () => {
    if (!selectedDriver) return;
    await fetch(`http://localhost:3001/admin/drivers/${selectedDriver.id}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reason: rejectionReason.trim() || 'Documentação não atende aos requisitos de segurança do SIMBORA',
      }),
    });
    setRejectModalOpen(false);
    setRejectionReason('');
    setSelectedDriver(null);
    fetchDrivers();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#123D32] tracking-tight">
            Gestão de Motoristas Parceiros — SIMBORA
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Aprovação cadastral, auditoria de documentos, repasses PIX e monitoramento no polo Alagoas.
          </p>
        </div>

        <button
          onClick={fetchDrivers}
          className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition self-start sm:self-auto"
        >
          ↻ Atualizar
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F8F9F6] border-b border-[#E2E8F0] text-xs font-extrabold text-[#123D32] uppercase">
            <tr>
              <th className="px-6 py-4">Motorista Parceiro</th>
              <th className="px-6 py-4">CNH / Categoria</th>
              <th className="px-6 py-4">Repasse PIX</th>
              <th className="px-6 py-4">Status Operacional</th>
              <th className="px-6 py-4">Status Cadastro</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                  Carregando motoristas cadastrados...
                </td>
              </tr>
            ) : drivers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                  Nenhum motorista cadastrado no momento.
                </td>
              </tr>
            ) : (
              drivers.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#17211D]">{d.user?.name || 'Motorista'}</div>
                    <div className="text-xs text-[#16A572] font-semibold">
                      ⭐ {d.rating || 5.0} • {d.totalTrips || 0} viagens realizadas
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{d.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600">
                    <p className="font-mono font-bold text-slate-700">{d.licenseNumber}</p>
                    <p className="text-slate-500 font-semibold">
                      Cat. <span className="text-[#123D32] font-extrabold">{d.cnhCategory || 'B'}</span>
                    </p>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-700">
                    {d.pixKey ? (
                      <div>
                        <p className="font-mono font-bold text-[#123D32]">{d.pixKey}</p>
                        <p className="text-[11px] text-slate-500">Tipo: {d.pixKeyType || 'PIX'}</p>
                      </div>
                    ) : (
                      <span className="text-slate-400">Pendente</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        d.status === 'online'
                          ? 'bg-[#DCFCE7] text-[#166534]'
                          : d.status === 'busy'
                          ? 'bg-[#FEF3C7] text-[#B45309]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          d.status === 'online'
                            ? 'bg-[#16A572]'
                            : d.status === 'busy'
                            ? 'bg-[#FFCC45]'
                            : 'bg-slate-400'
                        }`}
                      ></span>
                      {d.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        d.approvalStatus === 'approved'
                          ? 'bg-[#DCFCE7] text-[#166534]'
                          : d.approvalStatus === 'rejected'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-[#FEF3C7] text-[#B45309]'
                      }`}
                    >
                      {d.approvalStatus?.toUpperCase()}
                    </span>
                    {d.rejectionReason && (
                      <p className="text-[10px] text-rose-600 mt-1 max-w-xs truncate">
                        {d.rejectionReason}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenDocs(d)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                    >
                      Documentos
                    </button>
                    {d.approvalStatus !== 'approved' ? (
                      <button
                        onClick={() => handleApproveDriver(d.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#16A572] hover:bg-[#138e62] text-white text-xs font-bold transition shadow-xs"
                      >
                        Aprovar
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedDriver(d);
                          setRejectModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition"
                      >
                        Suspender
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Driver Documents Inspection Modal */}
      {selectedDriver && !rejectModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div>
                <h3 className="text-lg font-black text-[#123D32]">
                  Auditoria de Documentos — {selectedDriver.user?.name || 'Motorista'}
                </h3>
                <p className="text-xs text-slate-500">
                  CNH: {selectedDriver.licenseNumber} (Cat. {selectedDriver.cnhCategory || 'B'}) • PIX: {selectedDriver.pixKey || 'Pendente'}
                </p>
              </div>
              <button
                onClick={() => setSelectedDriver(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {docsLoading ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Carregando documentos do motorista...
                </div>
              ) : driverDocs.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500">
                  O motorista ainda não enviou nenhum arquivo comprobatório.
                </div>
              ) : (
                driverDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs uppercase tracking-wide text-[#123D32]">
                        {doc.type?.replace('_', ' ')}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-extrabold uppercase ${
                          doc.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : doc.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#16A572] underline font-bold"
                      >
                        Visualizar Arquivo Anexado ↗
                      </a>
                    </div>

                    {doc.reviewNotes && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                        Observação: {doc.reviewNotes}
                      </p>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60">
                      <button
                        onClick={() => handleReviewDoc(doc.id, 'rejected')}
                        className="px-3 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold transition"
                      >
                        Recusar Documento
                      </button>
                      <button
                        onClick={() => handleReviewDoc(doc.id, 'approved')}
                        className="px-3 py-1 bg-[#16A572] text-white hover:bg-[#138e62] rounded-lg text-xs font-bold transition"
                      >
                        Aprovar Documento
                      </button>
                    </div>
                  </div>
                ))
              )}

              <div className="pt-2">
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Nota do Parecer Geral:
                </label>
                <input
                  type="text"
                  placeholder="Observação para o motorista (ex: CNH aprovada com sucesso)..."
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#16A572]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setRejectModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition border border-rose-200"
              >
                Rejeitar / Bloquear Cadastro
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDriver(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Fechar
                </button>
                <button
                  onClick={() => handleApproveDriver(selectedDriver.id)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#16A572] hover:bg-[#138e62] text-white transition shadow-sm"
                >
                  Homologar Motorista 100%
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Driver Rejection Modal */}
      {rejectModalOpen && selectedDriver && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-black text-rose-700 mb-2">
              Rejeitar Cadastro de Motorista
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Informe o motivo da recusa cadastral para o motorista {selectedDriver.user?.name}.
            </p>

            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ex: CNH sem observação de EAR (Exerce Atividade Remunerada) ou certidão vencida..."
              className="w-full p-3 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500"
            />

            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Voltar
              </button>
              <button
                onClick={handleRejectDriver}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm"
              >
                Confirmar Rejeição
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
