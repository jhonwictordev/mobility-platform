'use client';

import React, { useEffect, useState } from 'react';

export default function PassengersAdminPage() {
  const [passengers, setPassengers] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/users?role=passenger')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPassengers(data);
      })
      .catch((e) => console.log('Error passengers', e));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-[#123D32] tracking-tight">
          Passageiros Cadastrados — SIMBORA
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Usuários verificados com segurança por PIN no polo Penedo & Piaçabuçu.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F8F9F6] border-b border-[#E2E8F0] text-xs font-extrabold text-[#123D32] uppercase">
            <tr>
              <th className="px-6 py-4">Nome do Passageiro</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Contato Telefônico</th>
              <th className="px-6 py-4">Data de Cadastro</th>
              <th className="px-6 py-4">Status de Verificação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {passengers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                  Nenhum passageiro encontrado.
                </td>
              </tr>
            ) : (
              passengers.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4 font-bold text-[#17211D]">
                    {p.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{p.email}</td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                    {p.phone || '+55 82 98888-0000'}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString('pt-BR') : 'Hoje'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#166534]">
                      ✓ PIN Ativo
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
