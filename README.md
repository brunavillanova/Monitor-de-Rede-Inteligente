# ⚡ Smart Grid Monitor

Sistema web desenvolvido para monitoramento e gerenciamento de equipamentos de uma rede elétrica inteligente.

O projeto permite visualizar equipamentos, acompanhar seus indicadores, identificar situações de alerta e falha, visualizar sua localização no mapa e registrar manutenções.

---

## 🚀 Sobre o projeto

O **Smart Grid Monitor** foi desenvolvido como um projeto de Engenharia de Software com foco em monitoramento de equipamentos e visualização de dados.

A aplicação possui um dashboard centralizado para acompanhar o estado dos equipamentos e seus principais indicadores:

- ⚡ Tensão
- 🔌 Corrente
- 🌡️ Temperatura
- 📍 Localização
- 🟢 Status operacional
- 🔧 Histórico de manutenções
- 📊 Indicadores do sistema

O sistema também possui uma API responsável pela comunicação com o banco de dados PostgreSQL.

---

## 🖥️ Funcionalidades

### 📊 Dashboard

Visualização geral dos equipamentos cadastrados e seus respectivos status.

O dashboard apresenta:

- Total de equipamentos online
- Equipamentos em alerta
- Equipamentos em falha
- Nível de risco
- Equipamentos em situação de risco
- Resumo das manutenções
- Mapa dos equipamentos

---

### ⚙️ Gerenciamento de equipamentos

É possível:

- Cadastrar equipamentos
- Editar equipamentos
- Excluir equipamentos
- Visualizar detalhes
- Consultar tensão
- Consultar corrente
- Consultar temperatura
- Visualizar localização

---

### 🌡️ Status automático

O status do equipamento é determinado de acordo com sua temperatura.

| Temperatura | Status |
|---|---|
| Abaixo de 50°C | 🟢 Online |
| 50°C até 69°C | 🟡 Alerta |
| 70°C ou mais | 🔴 Falha |

---

### 🗺️ Mapa

Os equipamentos podem ser visualizados geograficamente através de suas coordenadas de latitude e longitude.

---

### 🔧 Manutenções

O sistema permite registrar e consultar manutenções realizadas nos equipamentos.

Tipos disponíveis:

- Preventiva
- Corretiva
- Inspeção
- Emergencial

Também é possível acompanhar o status da manutenção:

- Concluída
- Em andamento
- Pendente

---

### 📈 Histórico de medições

O sistema possui estrutura para armazenar medições históricas dos equipamentos.

São armazenados:

- Temperatura
- Tensão
- Corrente
- Data e hora da medição

Essa estrutura permite a criação de gráficos e análises históricas dos equipamentos.

---

## 🛠️ Tecnologias utilizadas

### Frontend

- React
- TypeScript
- Vite
- Material UI
- Recharts
- React Leaflet
- Leaflet
- Lucide React

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM

### Banco de dados

- PostgreSQL

### Ferramentas

- Git
- GitHub
- Visual Studio Code
- Postman

---

## 📁 Estrutura do projeto

```text
Smart Grid Monitor/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── lib/
│   │   └── server.ts
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── package.json
│   └── prisma.config.ts
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
