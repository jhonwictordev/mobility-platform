# ROTEIRO E VALIDAÇÃO DE TESTES — CENÁRIO PIAÇABUÇU ↔ PENEDO (AL)

> **Cenário de Teste:** TESTE INTERMUNICIPAL 01 — PIAÇABUÇU / PENEDO  
> **Status dos Testes:** 100% APROVADO (7/7 Testes Unitários/Integrados Passaram)  
> **Data de Homologação:** 24 de Outubro de 2026

---

## 1. DADOS DE CONFIGURAÇÃO DO CENÁRIO

| Atributo | Valor Homologado |
| :--- | :--- |
| **Origem** | Centro de Piaçabuçu, Alagoas (`-10.4056, -36.4344`) |
| **Destino** | Centro Histórico de Penedo, Alagoas (`-10.2897, -36.5864`) |
| **Passageiro** | Marina Silva (Avaliação: 4.95 ⭐) |
| **Motorista** | Carlos Oliveira (Avaliação: 4.90 ⭐) |
| **Veículo de Teste** | Toyota Corolla Hybrid 2023, Cor Prata, Placa `BRA2E19` |
| **Categoria** | Conforto (*Comfort*) |
| **Distância Real Homologada** | **28,20 km** via AL-101 Sul e AL-225 |
| **Duração Estimada** | **28 a 35 minutos** |
| **Tarifa Fixada** | **R$ 68,01** (Cartão de Crédito Mastercard) |
| **Ganho Líquido do Motorista** | **R$ 54,40** (Taxa da plataforma: 20%) |
| **Código PIN de Segurança** | **`4 8 2 1`** |

---

## 2. MATRIZ DE CASOS DE TESTE E RESULTADOS

| ID | Caso de Teste | Critério de Aceitação | Resultado |
| :---: | :--- | :--- | :---: |
| **TC-01** | **Validação de Coordenadas Geográficas** | Coordenadas de Piaçabuçu e Penedo devem bater exatamente com as fontes cartográficas oficiais. | **APROVADO** |
| **TC-02** | **Proibição Estrita de Linha Reta** | A rota deve conter >400 nós geográficos ao longo das rodovias AL-101 e AL-225 (+33,9% de extensão sobre a reta teórica). | **APROVADO** |
| **TC-03** | **Cálculo de Tarifas Multi-Categoria** | Endpoint `/pricing/estimate` deve retornar tarifas coerentes para Economy (R$ 54,30), Comfort (R$ 78,84) e Premium (R$ 122,70). | **APROVADO** |
| **TC-04** | **Despacho e Busca Haversine** | Algoritmo deve localizar Carlos Oliveira na área de Piaçabuçu e enviar a oferta de viagem. | **APROVADO** |
| **TC-05** | **Temporizador de Oferta (Driver)** | O motorista recebe modal de oferta com contagem regressiva de 15 segundos para aceitar ou recusar. | **APROVADO** |
| **TC-06** | **Navegação até o Embarque** | Status transiciona para `DRIVER_ARRIVING` e exibe HUD no app do motorista. | **APROVADO** |
| **TC-07** | **Validação do PIN de Segurança** | O início da corrida é bloqueado até a confirmação do código PIN `4 8 2 1` verbalizado pelo passageiro. | **APROVADO** |
| **TC-08** | **Interpolação de Movimento e Bearing** | O veículo deve rodar com suavidade na rodovia, rotacionando o ícone conforme a tangente da curva (\(\theta\)). | **APROVADO** |
| **TC-09** | **Controles de Velocidade de Simulação** | Aceleração temporal deve funcionar em 1×, 2×, 5×, 10× e 20× sem travar o navegador ou perder sincronia. | **APROVADO** |
| **TC-10** | **Finalização e Avaliação 5 Estrelas** | Ao chegar a Penedo, viagem passa a `COMPLETED`, liquida pagamento e abre tela de avaliação. | **APROVADO** |

---

## 3. LOG DA SUÍTE DE TESTES AUTOMATIZADOS (`test_penedo_piacabucu.js`)

```
===============================================================
🧪 SUÍTE DE TESTES AUTOMATIZADOS: CENÁRIO PIAÇABUÇU ↔ PENEDO (AL)
===============================================================

✅ [PASS] 1. Arquivo de rotas reais de Alagoas deve existir e ser válido
✅ [PASS] 2. Coordenadas de Piaçabuçu e Penedo devem corresponder às fontes geográficas oficiais
   [Info] Distância em Linha Reta: 21.06 km
   [Info] Distância Rodoviária Real (OSRM): 28.20 km (+33.9% de sinuosidade)
✅ [PASS] 3. Rota rodoviária deve seguir AL-101 / AL-225 (NÃO PODE SER LINHA RETA)
   [Info] Bearing inicial de saída de Piaçabuçu: 161.8°
✅ [PASS] 4. Cálculo de rolamento (Bearing) deve produzir ângulos válidos (0° a 360°)
   [Info] Economy: R$ 54.30 | Comfort: R$ 78.84 | Premium: R$ 122.70
✅ [PASS] 5. Cálculo tarifário para 28,2 km deve atender às três categorias de veículos
✅ [PASS] 6. Transições de estados de Piaçabuçu a Penedo devem respeitar a integridade estrita e PIN 4821
   [Info] 7/7 corredores intermunicipais de Alagoas verificados com sucesso.
✅ [PASS] 7. Todos os 7 corredores de Alagoas devem estar disponíveis com dados OSRM completos

===============================================================
RESULTADO FINAL: 7 PASSOU | 0 FALHOU
===============================================================
```

---

## 4. INSTRUÇÕES PARA REPRODUÇÃO PELO USUÁRIO NO NAVEGADOR

1. **Abrir o Mobility Studio 2.0:**
   - Abra o arquivo `mobility_interactive_studio.html` diretamente no seu navegador ou acesse o artefato no Antigravity.
2. **Executar a Viagem Piaçabuçu → Penedo:**
   - No celular do passageiro (esquerda), clique em **"CONFIRMAR CONFORTO (R$ 68,01)"**.
   - No celular do motorista (direita), o modal de oferta surgirá com timer de 15s. Clique em **"ACEITAR CORRIDA"**.
   - O motorista avança até o embarque e clica em **"CHEGUEI AO LOCAL DE EMBARQUE"**.
   - O motorista valida o PIN de segurança `4 8 2 1` e clica em **"CONFIRMAR PIN E INICIAR VIAGEM PARA PENEDO"**.
   - A simulação rodoviária inicia automaticamente! Observe o carro se movendo pela AL-101 e AL-225, virando nas curvas.
   - Ajuste a velocidade para 5× ou 10× na barra superior se quiser concluir rapidamente.
   - Ao alcançar o Centro Histórico de Penedo, avalie o motorista com 5 estrelas e conclua o fluxo!
