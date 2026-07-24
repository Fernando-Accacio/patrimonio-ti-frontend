# 🚀 Chamados TI - Frontend

> Sistema de gestão de chamados do TI, focado em agilidade, atualizações em tempo real e separação de responsabilidades (User, Tech e Admin).

## 📌 Visão Geral

O Frontend do **Chamados TI** foi construído como uma Single Page Application (SPA) moderna e reativa. A arquitetura foi desenhada para suportar atualizações em tempo real (via Server-Sent Events - SSE), garantindo que técnicos e administradores vejam novos chamados instantaneamente sem precisar recarregar a página. O sistema possui controle de acesso rigoroso baseado em papéis (Role-Based Access Control - RBAC).

---

## 🛠️ Stack Tecnológica

* **Core:** React (construído com Vite para build ultrarrápido)
* **Estilização:** Tailwind CSS (com utilitários de animação) e PostCSS
* **Ícones:** Lucide React
* **Gerenciamento de Estado Global:** React Context API (`AuthContext`)
* **Lógica Isolada:** Custom Hooks (`useAdminDashboard`, `useTechDashboard`, etc.)
* **Comunicação com API:** Fetch/Axios via camada de serviços abstrata (`api.js`)
* **Tempo Real:** Server-Sent Events (SSE via `sse.js`)
* **Qualidade de Código:** ESLint e testes configurados (`setupTests.js`)

---

## 📂 Estrutura de Diretórios e Arquivos

A organização do projeto segue o princípio de modularidade, separando a aplicação por responsabilidades e por tipo de visão de usuário.

```text
PATRIMONIO-TI-FRONTEND/
├── .agents/
├── dist/                      # Arquivos de build gerados para produção
├── node_modules/
├── public/                    # Arquivos públicos e estáticos
├── src/                       # Código-fonte principal
│   ├── __tests__/             # Testes da aplicação
│   ├── assets/                # Imagens e ícones estáticos
│   │   ├── hero.png
│   │   ├── react.svg
│   │   ├── suporte-ao-cliente.png
│   │   └── vite.svg
│   ├── components/            # Componentes visuais reutilizáveis
│   │   ├── admin/             # 👑 Visão Administrativa
│   │   │   ├── dropdowns/
│   │   │   │   ├── StatusDropdown.jsx
│   │   │   │   └── TechDropdown.jsx
│   │   │   ├── DashboardStats.jsx
│   │   │   ├── EquipmentTable.jsx
│   │   │   ├── EquipmentTableRow.jsx
│   │   │   ├── ResetHistoryTable.jsx
│   │   │   ├── ResetRequestsTable.jsx
│   │   │   ├── TicketHistory.jsx
│   │   │   ├── TicketTable.jsx
│   │   │   ├── TicketTableRow.jsx
│   │   │   ├── UserManagementTable.jsx
│   │   │   └── UserManagementTableRow.jsx
│   │   ├── layout/            # 🧩 Estrutura de Página
│   │   │   └── Header.jsx
│   │   ├── modals/            # 🪟 Modais centralizados
│   │   │   ├── AlertModal.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── EquipmentFormModal.jsx
│   │   │   ├── FirstAccessLock.jsx
│   │   │   ├── GlobalModals.jsx
│   │   │   ├── ModalDevolucao.jsx
│   │   │   ├── PromptModal.jsx
│   │   │   ├── ResetPasswordModal.jsx
│   │   │   ├── SectorSelectModal.jsx
│   │   │   ├── UserFormModal.jsx
│   │   │   └── UserProfileModal.jsx
│   │   ├── tech/              # 🛠️ Visão Técnica
│   │   │   ├── TechHistoryTable.jsx
│   │   │   ├── TechHistoryTableRow.jsx
│   │   │   ├── TechMyTicketsTable.jsx
│   │   │   ├── TechMyTicketsTableRow.jsx
│   │   │   ├── TechQueueTable.jsx
│   │   │   └── TechQueueTableRow.jsx
│   │   └── user/              # 👤 Visão do Solicitante
│   │       ├── MyTicketsTable.jsx
│   │       ├── MyTicketsTableRow.jsx
│   │       ├── SectorSelectModal.jsx
│   │       ├── TicketForm.jsx
│   │       └── UserTicketHistory.jsx
│   ├── context/               # Gerenciadores de estado global
│   │   └── AuthContext.jsx
│   ├── hooks/                 # Regras de negócio isoladas (Custom Hooks)
│   │   ├── useAdminDashboard.js
│   │   ├── useAuthForm.js
│   │   ├── useTechDashboard.js
│   │   └── useUserDashboard.js
│   ├── pages/                 # Páginas roteadas
│   │   ├── AdminDashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── TechDashboard.jsx
│   │   └── UserDashboard.jsx
│   ├── services/              # Camada de comunicação externa
│   │   ├── api.js             # Contratos REST com o backend
│   │   └── sse.js             # Conexão de eventos Server-Sent
│   ├── App.css                # Estilos globais
│   ├── App.jsx                # Ponto de entrada do roteamento
│   ├── index.css              # Configurações do Tailwind
│   ├── main.jsx               # Ponto de montagem no DOM
│   └── setupTests.js          # Configurações de suíte de testes
├── .gitignore
├── eslint.config.js           # Regras de linting
├── index.html                 # Template base da SPA
├── package.json               # Dependências e scripts
├── postcss.config.js          # Processador CSS
├── tailwind.config.js         # Configurações do framework de estilos
└── vite.config.js             # Configurações do bundler

```

---

## 🔑 Perfis de Acesso (RBAC) e Componentização

A interface se adapta dinamicamente com base no papel (`role`) do usuário, isolando os componentes para evitar vazamento de privilégios:

* **USER (Página `UserDashboard.jsx`):** Acessa apenas os componentes da pasta `src/components/user/`. Pode abrir novos chamados (`TicketForm`), visualizar o status dos próprios tickets e aprovar ou recusar resoluções.
* **TECH (Página `TechDashboard.jsx`):** Acessa a pasta `src/components/tech/`. Visualiza a fila geral de chamados que ainda não foram atribuídos a ninguém (`TechQueueTable`), gerencia exclusivamente os chamados que foram atribuídos a ele (`TechMyTicketsTable`) e consulta o seu próprio histórico de chamados resolvidos (`TechHistoryTable`).
* **ADMIN (Página `AdminDashboard.jsx`):** Acesso completo via `src/components/admin/`. Visão global de tickets (`TicketTable`), painel de estatísticas (`DashboardStats`), gestão de cadastros de usuários (`UserManagementTable`) e equipamentos/setores (`EquipmentTable`).

---

## ⚡ Contratos de Arquitetura e Fluxos

### 1. Separação de Preocupações (Hooks)

O projeto isola rigidamente a *Apresentação* (UI) da *Regra de Negócio*. Nenhuma página faz requisições diretas. Em vez disso, páginas como `AdminDashboard.jsx` importam os estados e ações diretamente do seu respectivo hook (`useAdminDashboard.js`).

### 2. Atualizações em Tempo Real (SSE)

O frontend conta com um serviço dedicado (`src/services/sse.js`) que mantém uma conexão unidirecional aberta com o Backend.

* **Fluxo:** Quando uma ação crítica acontece (ex: abertura de um chamado), o servidor emite o evento `RELOAD_DATA`. O `sse.js` intercepta, notifica os hooks montados na tela e dispara uma re-validação silenciosa (Refetch) da lista de chamados. A tela é atualizada em tempo real sem a necessidade do usuário pressionar "F5".

### 3. Gestão de Modais Centralizados

A aplicação evita inflar a árvore de componentes com dezenas de pop-ups escondidos. Arquivos como `GlobalModals.jsx` gerenciam o ciclo de vida e a renderização de modais complexos, como aprovações de reset de senha e relatórios de devolução (`ModalDevolucao.jsx`).

---

## 🚀 Como Executar o Projeto Localmente

**1. Clone o repositório e acesse a pasta do Frontend:**

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd PATRIMONIO-TI-FRONTEND

```

**2. Instale as dependências:**
Certifique-se de possuir o Node.js (versão 18 ou superior) instalado.

```bash
npm install

```

**3. Configure as Variáveis de Ambiente:**
Crie um arquivo `.env` na raiz do projeto e configure a URL de comunicação com a API do Backend.

```env
VITE_API_URL=http://localhost:3000/api

```

**4. Inicie o Servidor de Desenvolvimento:**

```bash
npm run dev

```

O Vite iniciará o servidor localmente (geralmente na porta `5173`) com Fast Refresh ativado.

---

## 📏 Padrões de Código e Boas Práticas

* **Resiliência (Fallback):** Uso constante de encadeamento opcional (`?.`) e operadores de coalescência nula (`|| []`) ao mapear propriedades que vêm do banco de dados, evitando "telas brancas" (`Crash`) caso os dados estejam imcompletos.
* **Componentização Semântica:** Tabelas grandes foram divididas. Ex: `TicketTable.jsx` gerencia a estrutura e a lógica de paginação, enquanto `TicketTableRow.jsx` lida exclusivamente com o design e apresentação de uma única linha.
* **Design System (Tailwind):** Padronização de cores usando as paletas `slate`, `blue` e `emerald`, garantindo uma identidade visual limpa (Clean UI) e profissional, sem necessidade de arquivos CSS extensos de manutenção difícil.