# Case Comercial — Plataforma SIMBORA Mobilidade Urbana e Intermunicipal

## PROBLEMA
Operadoras regionais de transporte, cooperativas de motoristas e frotistas municipais enfrentam extrema dificuldade para gerenciar corridas sob demanda, homologar veículos e motoristas, calcular tarifas justas e rastrear viagens em tempo real. A dependência de grandes aplicativos multinacionais impõe comissões abusivas (de 25% a 40%), ausência de controle sobre políticas tarifárias locais e falta de adaptação a rotas intermunicipais específicas do interior e litoral brasileiro.

## SOLUÇÃO
A **SIMBORA Mobility Platform** é uma solução completa de mobilidade urbana e intermunicipal desenvolvida com arquitetura modular de alta confiabilidade. A plataforma integra API de despacho com máquina de estados rigorosa, portal administrativo para gestão de frotas e solicitações veiculares, e um estúdio interativo demonstrativo capaz de simular em tempo real os fluxos concomitantes de passageiros, motoristas e gestores operacionais.

## FUNCIONALIDADES COMPROVADAS
- **Máquina de Estados de Corridas**: 10 estados operacionais estritamente tipados (`REQUESTED`, `SEARCHING`, `ACCEPTED`, `DRIVER_ARRIVING`, `DRIVER_ARRIVED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED_BY_PASSENGER`, `CANCELLED_BY_DRIVER`, `EXPIRED`) com validação de transições válidas e bloqueio de retrocessos.
- **Prevenção Atômica de Race Condition**: Bloqueio de corrida em nível atômico impedindo que múltiplos motoristas aceitem o mesmo chamado simultaneamente.
- **Motor de Precificação Dinâmica Multi-Categoria**: Cálculo parametrizado para categorias `Economy`, `Comfort` e `Premium`, contemplando tarifa base, valor por quilômetro rodado, valor por minuto e multiplicador de demanda (surge pricing).
- **Homologação e Gestão Documental de Veículos**: Fluxo de aprovação administrativa de veículos e aprovação/rejeição de pedidos de alteração cadastral com justificativa e trilha de auditoria.
- **Painel Executivo e Métricas Financeiras**: Visualização de corridas, motoristas ativos, receita bruta, repasses líquidos e gráficos de faturamento semanal.
- **Estúdio Interativo Integrado (`mobility_interactive_studio.html`)**: Ambiente de demonstração completo com mapas vetoriais Leaflet/MapTiler, simulação de telemetria GPS, alternância dinâmica de papéis (Passageiro, Motorista, Administrador) e rotas reais do corredor alagoano (ex: Penedo ⇄ Piaçabuçu).

## TECNOLOGIAS VERIFICADAS
- **Backend**: NestJS, TypeScript, TypeORM, WebSocket Gateway, SQLite / PostgreSQL.
- **Frontend & Painel Admin**: Next.js, React, Tailwind CSS, Lucide Icons.
- **Geolocalização & Mapas**: Leaflet, MapTiler Vector Tiles, OpenStreetMap, algoritmos de Haversine e interpolação de rotas.
- **Garantia de Qualidade & Testes**: Node.js Test Runner, Playwright, scripts de validação de sintaxe e testes de integração de sprints.

## DIFERENCIAIS
- **Autonomia Regional**: Calibração nativa para corredores rodoviários e cidades de médio/pequeno porte onde os grandes aplicativos não operam com eficiência.
- **Estúdio de Demonstração Imediato**: Permite a apresentação visual da solução a investidores e clientes sem requerer infraestrutura de nuvem dispendiosa.
- **Arquitetura de Dados Resiliente**: Separação clara entre camada de entidades, serviços de negócio e controladores RESTful com validação rígida de DTOs.

## STATUS
**MVP Funcional & Demonstrador Tecnológico Avançado** — Módulos de despacho, precificação, homologação veicular e simulação interativa validados e testáveis localmente.

## VALOR COMERCIAL
- **Redução Imediata de Custos**: Elimina taxas de plataformas terceiras, permitindo que a operadora retenha a margem líquida da operação ou repasse ganhos mais atrativos aos motoristas parceiros.
- **Controle Total da Operação**: Permite customizar tarifas por horário, criar zonas de preço especiais para feriados e eventos regionais, e auditar integralmente as solicitações veiculares para garantir conformidade legal.
- **Ativo Proprietário**: A empresa contratante passa a deter o controle do software, dados de passageiros e histórico de corridas, construindo patrimônio tecnológico próprio.
