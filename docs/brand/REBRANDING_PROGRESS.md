# 📋 REBRANDING PROGRESS — SIMBORA PLATFORM
## Registro de Execução e Status da Migração Visual

Data de Início: Outubro de 2026  
Status Geral: **Em Andamento (Fase de Implementação de Código & Simulador)**  

---

## Matriz de Entregáveis

| Item | Descrição | Status | Arquivo / Localização |
| :--- | :--- | :--- | :--- |
| **1. Análise do Projeto** | Mapeamento da arquitetura limpa, backend NestJS e frontend Next.js/Expo | ✅ Concluído | Inspecionado e validado |
| **2. Backup de Segurança** | Cópia preventiva de arquivos críticos | ✅ Concluído | `.backup_pre_rebrand/` |
| **3. Propostas de Logotipo** | Criação vetorial das 3 opções (Wordmark, Símbolo e Híbrida) | ✅ Concluído | `packages/ui/brand/logos/` |
| **4. Ícones do Aplicativo** | Android adaptive, iOS, Favicon, Notificações e Splash | ✅ Concluído | `packages/ui/brand/icons/` & `splash/` |
| **5. Materiais de Marketing** | Avatares, Banner, Cartão digital, Adesivo de carro e Story | ✅ Concluído | `packages/ui/brand/marketing/` |
| **6. Guias e Manuais** | BRAND_GUIDELINES, DESIGN_SYSTEM, COLOR_TOKENS, TYPOGRAPHY, LOGO_USAGE, UI_UX_GUIDELINES | ✅ Concluído | `docs/brand/` |
| **7. Design Tokens no Código**| Atualização de `packages/ui/index.ts` com paleta SIMBORA e Alagoas | 🟡 Em Execução | `packages/ui/index.ts` |
| **8. Dados e Rotas Alagoas** | Adicionar rotas Piaçabuçu → Penedo e coordenadas regionais | 🟡 Em Execução | `packages/alagoas_routes.json` & `packages/config/` |
| **9. SIMBORA Admin** | Rebranding completo do Painel Web (Header, Sidebar, Cores, KPIs) | 🟡 Em Execução | `apps/admin/src/app/` |
| **10. SIMBORA Studio** | Simulador Alagoas (Piaçabuçu → Penedo) com 2 celulares sincronizados e mapa | 🟡 Em Execução | `apps/admin/src/app/studio/` |
| **11. App Passageiro** | Aplicação da identidade visual SIMBORA nas telas do passageiro | 🟡 Em Execução | `apps/passenger/` |
| **12. App Motorista** | Aplicação da identidade SIMBORA Motorista no cockpit | 🟡 Em Execução | `apps/driver/` |
| **13. Validação e Testes** | Execução de testes automatizados e verificação de não-regressão | ⏳ Pendente | `tests/state-machine.test.js` |

---

## Registro de Atualizações
- **Fase 1:** Concluída a criação de todos os assets gráficos vetoriais (SVGs), manuais de marca e matriz de contraste WCAG AA.
- **Fase 2:** Iniciada a injeção dos tokens nos pacotes compartilhados e desenvolvimento do SIMBORA Studio com cenário Alagoas.
