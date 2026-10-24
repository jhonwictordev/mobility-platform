import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mobility Admin — Centro de Operações',
  description: 'Painel administrativo e despacho em tempo real',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-50 text-slate-900 flex h-screen antialiased">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-xl">
              M
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">Mobility Admin</h1>
              <p className="text-xs text-slate-400">Operations Suite</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-sm font-semibold transition"
            >
              <span>📊</span> Dashboard
            </Link>
            <Link
              href="/trips"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-sm font-semibold transition"
            >
              <span>🛣️</span> Corridas & Despacho
            </Link>
            <Link
              href="/drivers"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-sm font-semibold transition"
            >
              <span>🚗</span> Motoristas
            </Link>
            <Link
              href="/passengers"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-sm font-semibold transition"
            >
              <span>👥</span> Passageiros
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-sm font-semibold transition"
            >
              <span>⚙️</span> Tarifas & Config
            </Link>
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/60 rounded-xl">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <div className="text-xs">
                <p className="font-semibold text-slate-200">API Local Conectada</p>
                <p className="text-slate-400">Porta 3001 • Socket.IO</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Sistema de Mobilidade Urbana — Região Metropolitana de São Paulo
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                Online: 3 Motoristas
              </span>
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                AD
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
