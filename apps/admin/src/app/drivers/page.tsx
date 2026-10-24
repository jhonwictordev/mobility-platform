'use client';

import React, { useEffect, useState } from 'react';

export default function DriversAdminPage() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDrivers = () => {
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

  const handleApprove = async (driverId: string) => {
    await fetch(`http://localhost:3001/admin/drivers/${driverId}/approve`, {
      method: 'PUT',
    });
    fetchDrivers();
  };

  const handleReject = async (driverId: string) => {
    await fetch(`http://localhost:3001/admin/drivers/${driverId}/reject`, {
      method: 'PUT',
    });
    fetchDrivers();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-[#123D32] tracking-tight">
          Gestão de Motoristas Parceiros — SIMBORA
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Aprovação cadastral, histórico de viagens e validação de veículos no polo Alagoas.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F8F9F6] border-b border-[#E2E8F0] text-xs font-extrabold text-[#123D32] uppercase">
            <tr>
              <th className="px-6 py-4">Motorista Parceiro</th>
              <th className="px-6 py-4">CNH / Contato</th>
              <th className="px-6 py-4">Veículo Homologado</th>
              <th className="px-6 py-4">Status Operacional</th>
              <th className="px-6 py-4">Cadastro</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {drivers.length === 0 ? (
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
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600">
                    <p className="font-mono font-bold text-slate-700">{d.licenseNumber}</p>
                    <p className="text-slate-400">{d.user?.phone || '+55 82 99999-0000'}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-700">
                    {d.vehicle ? (
                      <>
                        <p className="font-bold text-[#123D32]">
                          {d.vehicle.make} {d.vehicle.model}
                        </p>
                        <p className="text-slate-500 font-mono">
                          {d.vehicle.plateNumber} • {d.vehicle.color}
                        </p>
                      </>
                    ) : (
                      <span className="text-slate-400">Sem veículo cadastrado</span>
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
                          : 'bg-[#FEF3C7] text-[#B45309]'
                      }`}
                    >
                      {d.approvalStatus?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {d.approvalStatus !== 'approved' && (
                      <button
                        onClick={() => handleApprove(d.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#16A572] hover:bg-[#138e62] text-white text-xs font-bold transition"
                      >
                        Aprovar
                      </button>
                    )}
                    {d.approvalStatus === 'approved' && (
                      <span className="text-xs font-bold text-[#16A572]">
                        ✓ Verificado
                      </span>
                    )}
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
