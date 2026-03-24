# Plano de Implementação: Geração em Massa de Vagas da Kowa Corporation

## Objetivo
Criar diversas vagas de emprego fictícias no sistema a partir do modelo base fornecido pelo usuário ("Produção de compressor para autos" em Isesaki, Kowa Corporation), variando apenas parâmetros chaves como Localização, Salário e Turno. O processo seguirá o fluxo Multi-Agente de Orquestração.

## 🔴 PHASE 1: Estrutura Base e Planejamento (`project-planner`)
**Template da Vaga Extraída:**
- **Empresa:** Kowa Corporation
- **Título Base:** Produção de compressor para autos
- **Salário Base:** ¥1.500 / Hora
- **Turno:** Alternado (8h10-18h10 / 18h-2h50)
- **Modo:** Presencial
- **Contrato:** Contrato de trabalho
- **Requisitos:** Ambos os sexos, Aceita Seniores, Nihongo Médio (40-50%), Hiragana/Katakana essenciais.
- **Benefícios:** Apartamento, Ajuda na mudança, Auxílio combustível, Horas Extras (25% adicionais em folgas).

**Variantes Propostas (A serem geradas):**
1. Variante A: Local: Oizumi (Gunma) | Salário: ¥1.450/h | Turno: Diurno Fixo
2. Variante B: Local: Ota (Gunma) | Salário: ¥1.600/h | Turno: Noturno Fixo
3. Variante C: Local: Hamamatsu (Shizuoka) | Salário: ¥1.550/h | Turno: Alternado
4. Variante D: Local: Toyohashi (Aichi) | Salário: ¥1.700/h | Turno: Alternado | Foco: Qualidade e Inspeção
5. Variante E: Local: Tochigi | Salário: ¥1.400/h | Turno: Diurno Fixo

## 🟠 PHASE 2: Implementação Backend / Dados (`backend-specialist`)
- Estender os registros dentro de `src/lib/adminService.ts` (`MOCK_JOBS`).
- Gerar IDs únicos para essas 5 novas vagas atreladas à `company_id: 'c_kowa'`.
- Aproveitar as listas de `requirements` e `benefits` idênticas, apenas alterando `location` e `salary_min` (calculado ou mapeado como `salary_tbd: true`). E formataremos o salário no novo campo `description` para incluir o valor hora caso necessário.
- Atualizar o contador de vagas ativas da empresa de 8 para 13.

## 🟢 PHASE 3: Verificação de Ponta a Ponta (`test-engineer`)
- Como foi recém validado o visual via navegador, injetaremos e confirmaremos a ausência de quebras no Admin com TS Check.
- Pode-se enviar o Browser Subagent até a tela de Edição de uma dessas variações na visão da Empresa.

---

**Agentes Envolvidos:**
1. `project-planner`: Coordenação e extração da matriz variante desta vaga. (Concluído)
2. `backend-specialist`: Geração massiva no Backend.
3. `test-engineer`: Garantia de Qualidade da listagem gerada.
