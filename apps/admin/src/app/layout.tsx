import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SIMBORA Admin — Centro de Operações de Mobilidade',
  description: 'Painel administrativo e despacho em tempo real — Alagoas (Penedo ⇄ Piaçabuçu)',
  icons: {
    icon: '/brand/icons/favicon.svg',
    shortcut: '/brand/icons/favicon.svg',
    apple: '/brand/icons/app-icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#F8F9F6] text-[#17211D] flex h-screen antialiased font-sans">
        {/* Sidebar SIMBORA */}
        <aside className="w-68 bg-[#123D32] text-white flex flex-col border-r border-[#0D2E25] shadow-xl">
          {/* Logo & Sub-Brand Header */}
          <div className="p-5 border-b border-[#1A5243]/60 flex items-center gap-3 bg-[#0E2922]">
            <div className="w-10 h-10 rounded-xl bg-[#17211D] border border-[#16A572] flex items-center justify-center shadow-md overflow-hidden p-1">
              <img
                src="/brand/icons/favicon.svg"
                alt="Simbora Ícone"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-wider text-white">SIMBORA</span>
                <span className="text-[10px] font-extrabold bg-[#FFCC45] text-[#123D32] px-1.5 py-0.5 rounded">ADMIN</span>
              </div>
              <p className="text-[11px] text-[#16A572] font-semibold tracking-wide">
                Penedo ⇄ Piaçabuçu • AL
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1A5243] text-sm font-semibold transition text-slate-100 hover:text-white group"
            >
              <span className="text-lg">📊</span>
              <span>Dashboard</span>
            </Link>

            {/* SIMBORA STUDIO (DESTAQUE SIMULADOR ALAGOAS) */}
            <Link
              href="/studio"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-[#16A572]/20 to-[#FFCC45]/10 border border-[#16A572]/40 hover:border-[#FFCC45] text-sm font-bold text-white transition shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">⚡</span>
                <span>SIMBORA Studio</span>
              </div>
              <span className="text-[10px] font-black bg-[#FFCC45] text-[#123D32] px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                Simulador
              </span>
            </Link>

            <Link
              href="/trips"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1A5243] text-sm font-semibold transition text-slate-100 hover:text-white"
            >
              <span className="text-lg">🛣️</span>
              <span>Corridas & Despacho</span>
            </Link>

            <Link
              href="/drivers"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1A5243] text-sm font-semibold transition text-slate-100 hover:text-white"
            >
              <span className="text-lg">🚗</span>
              <span>Frota de Motoristas</span>
            </Link>

            <Link
              href="/vehicles"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1A5243] text-sm font-semibold transition text-slate-100 hover:text-white"
            >
              <span className="text-lg">🛡️</span>
              <span>Veículos & Vistoria</span>
            </Link>

            <Link
              href="/vehicles/requests"
              className="flex items-center justify-between px-4 py-2.5 ml-4 rounded-xl hover:bg-[#1A5243] text-xs font-semibold transition text-slate-200 hover:text-white border-l-2 border-[#16A572]"
            >
              <div className="flex items-center gap-2">
                <span>🔄</span>
                <span>Solicitações de Troca</span>
              </div>
              <span className="text-[9px] font-black bg-[#FFCC45] text-[#123D32] px-1.5 py-0.5 rounded">
                NOVO
              </span>
            </Link>

            <Link
              href="/passengers"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1A5243] text-sm font-semibold transition text-slate-100 hover:text-white"
            >
              <span className="text-lg">👥</span>
              <span>Passageiros</span>
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1A5243] text-sm font-semibold transition text-slate-100 hover:text-white"
            >
              <span className="text-lg">⚙️</span>
              <span>Tarifas & Config</span>
            </Link>
          </nav>

          {/* Slogan Banner */}
          <div className="mx-4 mb-3 p-3 rounded-xl bg-[#0E2922] border border-[#16A572]/30 text-center">
            <p className="text-[11px] font-black text-[#FFCC45] tracking-widest uppercase">
              Pediu. Chegou. Simbora!
            </p>
            <p className="text-[10px] text-slate-300 mt-0.5">
              Alagoas Mobilidade v1.0
            </p>
          </div>

          {/* Operational Status Footer */}
          <div className="p-4 border-t border-[#1A5243]/60 bg-[#0E2922]">
            <div className="flex items-center gap-3 px-3 py-2 bg-[#17211D] rounded-xl border border-[#233830]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#16A572] animate-pulse"></div>
              <div className="text-xs">
                <p className="font-bold text-slate-200">API Alagoas Conectada</p>
                <p className="text-slate-400 text-[11px]">Porta 3001 • Telemetria Ativa</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#F8F9F6]">
          {/* Top Bar */}
          <header className="h-16 bg-white border-b border-[#E2E8F0] px-8 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#16A572]"></span>
              <h2 className="text-xs font-extrabold text-[#123D32] uppercase tracking-wider">
                SIMBORA — Plataforma Regional de Mobilidade • Penedo ⇄ Piaçabuçu (Alagoas)
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs bg-[#DCFCE7] text-[#166534] border border-[#16A572]/30 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16A572]"></span>
                Corredor AL-101 / AL-225 Ativo
              </span>
              <div className="w-8 h-8 rounded-full bg-[#123D32] border border-[#FFCC45] text-[#FFCC45] font-black flex items-center justify-center text-xs shadow-xs">
                SB
              </div>
            </div>
          </header>

          {/* Main Scrollable View */}
          <div className="flex-1 overflow-y-auto p-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
