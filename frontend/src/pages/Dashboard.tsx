import { useEffect, useState } from "react";

import { api } from "../services/api";

import { StatsCard } from "../components/StatsCard";
import { GridMap } from "../components/GridMap";
import { MetricsChart } from "../components/MetricsChart";
import { NovoEquipamento } from "../components/NovoEquipamento";
import { DetalhesEquipamento } from "../components/DetalhesEquipamento";
import { EditarEquipamento } from "../components/EditarEquipamento";
import { ResumoManutencoes } from "../components/ResumoManutencoes";

interface Equipamento {
  id: number;
  nome: string;
  latitude: number;
  longitude: number;
  status: string;
  tensao?: number;
  corrente?: number;
  temperatura?: number;
}

export function Dashboard() {
  // =========================================================
  // STATES
  // =========================================================

  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);

  const [aba, setAba] = useState("dashboard");

  const [busca, setBusca] = useState("");

  const [filtroStatus, setFiltroStatus] = useState("todos");

  const [equipamentoEditando, setEquipamentoEditando] =
    useState<Equipamento | null>(null);

  const [equipamentoSelecionado, setEquipamentoSelecionado] =
    useState<Equipamento | null>(null);

  // Menu mobile
  const [menuAberto, setMenuAberto] = useState(false);

  // =========================================================
  // CARREGAR EQUIPAMENTOS
  // =========================================================

  useEffect(() => {
    carregarEquipamentos();
  }, []);

  async function carregarEquipamentos() {
    try {
      const response = await api.get("/equipamentos");

      setEquipamentos(response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar equipamentos");
    }
  }

  // =========================================================
  // EXCLUIR EQUIPAMENTO
  // =========================================================

  async function excluirEquipamento(id: number) {
    const confirmar = window.confirm(
      "Deseja realmente excluir este equipamento?"
    );

    if (!confirmar) return;

    try {
      await api.delete(`/equipamentos/${id}`);

      await carregarEquipamentos();

      alert("Equipamento excluído!");
    } catch (error) {
      console.error(error);

      alert("Erro ao excluir equipamento");
    }
  }

  // =========================================================
  // ESTATÍSTICAS
  // =========================================================

  const online = equipamentos.filter(
    (e) => e.status === "online"
  ).length;

  const alerta = equipamentos.filter(
    (e) => e.status === "alerta"
  ).length;

  const falha = equipamentos.filter(
    (e) => e.status === "falha"
  ).length;

  const risco =
    falha > 5
      ? "ALTO"
      : falha > 2
      ? "MÉDIO"
      : "BAIXO";

  // =========================================================
  // EQUIPAMENTOS EM RISCO
  // =========================================================

  const equipamentosEmRisco = equipamentos.filter(
    (equipamento) =>
      equipamento.status === "alerta" ||
      equipamento.status === "falha"
  );

  const totalEmRisco = equipamentosEmRisco.length;

  // =========================================================
  // COR DO STATUS
  // =========================================================

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#22c55e";

      case "alerta":
        return "#eab308";

      case "falha":
        return "#ef4444";

      default:
        return "#6b7280";
    }
  };

  // =========================================================
  // FILTROS
  // =========================================================

  const equipamentosFiltrados = equipamentos.filter(
    (equipamento) => {
      const matchNome = equipamento.nome
        .toLowerCase()
        .includes(busca.toLowerCase());

      const matchStatus =
        filtroStatus === "todos"
          ? true
          : equipamento.status === filtroStatus;

      return matchNome && matchStatus;
    }
  );

  // =========================================================
  // NAVEGAÇÃO
  // =========================================================

  function navegarPara(novaAba: string) {
    setAba(novaAba);

    setEquipamentoSelecionado(null);

    setMenuAberto(false);
  }

  // =========================================================
  // ESTILO DOS BOTÕES
  // =========================================================

  const sidebarButton = (ativa: boolean) => ({
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "left" as const,
    background: ativa ? "#2563eb" : "#1f2937",
    color: "#fff",
    fontWeight: 600,
    transition: "0.2s",
  });

  // =========================================================
  // TELA
  // =========================================================

  return (
    <>
      {/* =====================================================
          ESTILOS RESPONSIVOS
      ===================================================== */}

      <style>
        {`
          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            width: 100%;
            min-height: 100%;
          }

          body {
            overflow-x: hidden;
          }

          .dashboard-container {
            display: flex;
            min-height: 100vh;
            width: 100%;
            background: #0f172a;
            color: white;
          }

          /* ==============================
             SIDEBAR
          ============================== */

          .dashboard-sidebar {
            width: 260px;
            min-height: 100vh;
            background: #111827;
            padding: 20px;
            border-right: 1px solid #374151;
            flex-shrink: 0;
            transition: 0.3s ease;
          }

          .sidebar-logo {
            margin: 0 0 30px 0;
            font-size: 24px;
          }

          .sidebar-button {
            width: 100%;
          }

          /* ==============================
             CONTEÚDO
          ============================== */

          .dashboard-content {
            flex: 1;
            min-width: 0;
            padding: 30px;
            width: 100%;
          }

          .dashboard-title {
            text-align: center;
            margin: 0 0 30px 0;
            font-size: 48px;
            line-height: 1.2;
            word-break: break-word;
          }

          /* ==============================
             MENU MOBILE
          ============================== */

          .mobile-header {
            display: none;
          }

          .mobile-menu-button {
            border: none;
            background: #2563eb;
            color: white;
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 20px;
            cursor: pointer;
          }

          /* ==============================
             CARDS
          ============================== */

          .dashboard-cards {
            display: flex;
            justify-content: center;
            align-items: stretch;
            gap: 20px;
            margin-bottom: 40px;
            flex-wrap: wrap;
          }

          /* ==============================
             ALERTAS
          ============================== */

          .alert-panel {
            background: #111827;
            border: 1px solid #374151;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
          }

          .alert-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
            margin-bottom: 20px;
            flex-wrap: wrap;
          }

          .alert-header-text {
            flex: 1;
            min-width: 200px;
          }

          .alert-grid {
            display: grid;
            grid-template-columns:
              repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
          }

          /* ==============================
             FILTROS
          ============================== */

          .filters-container {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            width: 100%;
          }

          .search-input {
            flex: 1;
            min-width: 0;
          }

          .status-select {
            width: 160px;
          }

          .search-input,
          .status-select {
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #374151;
            background: #111827;
            color: white;
            outline: none;
          }

          /* ==============================
             TABELA
          ============================== */

          .table-container {
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            border-radius: 12px;
          }

          .equipment-table {
            width: 100%;
            min-width: 900px;
            border-collapse: collapse;
            background: #111827;
            border-radius: 12px;
            overflow: hidden;
          }

          .equipment-table th {
            padding: 14px 12px;
            background: #1f2937;
            color: #e5e7eb;
            text-align: left;
            white-space: nowrap;
          }

          .equipment-table td {
            padding: 12px;
            border-top: 1px solid #374151;
            color: #d1d5db;
            white-space: nowrap;
          }

          .equipment-table tr:hover {
            background: #172033;
          }

          .action-buttons {
            display: flex;
            gap: 8px;
            padding: 10px;
          }

          .action-button {
            border: none;
            color: white;
            border-radius: 6px;
            padding: 7px 10px;
            cursor: pointer;
            font-size: 15px;
          }

          /* ==============================
             TÍTULOS DAS ABAS
          ============================== */

          .section-title {
            text-align: center;
            margin: 0 0 20px 0;
          }

          /* ==============================
             TABLET
          ============================== */

          @media (max-width: 900px) {
            .dashboard-sidebar {
              width: 220px;
              padding: 15px;
            }

            .dashboard-content {
              padding: 20px;
            }

            .dashboard-title {
              font-size: 38px;
            }
          }

          /* ==============================
             CELULAR
          ============================== */

          @media (max-width: 700px) {

            .dashboard-container {
              display: block;
              min-height: 100vh;
            }

            /* Header mobile */

            .mobile-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 12px;
              width: 100%;
              padding: 12px 15px;
              background: #111827;
              border-bottom: 1px solid #374151;
              position: sticky;
              top: 0;
              z-index: 1000;
            }

            .mobile-header-title {
              font-size: 18px;
              font-weight: bold;
              margin: 0;
            }

            /* Sidebar vira menu */

            .dashboard-sidebar {
              position: fixed;
              top: 61px;
              left: 0;
              width: 100%;
              min-height: auto;
              max-height: calc(100vh - 61px);
              overflow-y: auto;
              padding: 15px;
              background: #111827;
              border-right: none;
              border-bottom: 1px solid #374151;
              z-index: 999;
              transform: translateY(-120%);
              opacity: 0;
              pointer-events: none;
            }

            .dashboard-sidebar.mobile-open {
              transform: translateY(0);
              opacity: 1;
              pointer-events: auto;
            }

            .sidebar-logo {
              display: none;
            }

            .dashboard-sidebar button {
              margin-top: 8px !important;
            }

            /* Conteúdo */

            .dashboard-content {
              width: 100%;
              padding: 15px;
            }

            .dashboard-title {
              font-size: 28px;
              margin-bottom: 22px;
            }

            /* Cards */

            .dashboard-cards {
              display: grid;
              grid-template-columns: 1fr;
              gap: 12px;
              margin-bottom: 25px;
            }

            /* Alertas */

            .alert-panel {
              padding: 15px;
            }

            .alert-header {
              display: flex;
              flex-direction: column;
              align-items: stretch;
              gap: 15px;
            }

            .alert-header button {
              width: 100%;
            }

            .alert-grid {
              grid-template-columns: 1fr;
            }

            /* Filtros */

            .filters-container {
              flex-direction: column;
              gap: 10px;
            }

            .search-input,
            .status-select {
              width: 100%;
              min-width: 0;
            }

            /* Tabela */

            .table-container {
              width: 100%;
              overflow-x: auto;
            }

            .equipment-table {
              min-width: 850px;
            }

            /* Ações */

            .action-buttons {
              padding: 8px;
            }

            .action-button {
              padding: 8px 10px;
            }
          }

          /* ==============================
             CELULAR PEQUENO
          ============================== */

          @media (max-width: 400px) {

            .mobile-header {
              padding: 10px;
            }

            .mobile-header-title {
              font-size: 16px;
            }

            .dashboard-content {
              padding: 10px;
            }

            .dashboard-title {
              font-size: 24px;
            }

            .alert-panel {
              padding: 12px;
            }

            .section-title {
              font-size: 22px;
            }
          }
        `}
      </style>

      {/* =====================================================
          CONTAINER PRINCIPAL
      ===================================================== */}

      <div className="dashboard-container">

        {/* ===================================================
            HEADER MOBILE
        =================================================== */}

        <div className="mobile-header">
          <p className="mobile-header-title">
            ⚡ Smart Grid
          </p>

          <button
            className="mobile-menu-button"
            onClick={() =>
              setMenuAberto(!menuAberto)
            }
            aria-label="Abrir menu"
          >
            {menuAberto ? "✕" : "☰"}
          </button>
        </div>

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <div
          className={`dashboard-sidebar ${
            menuAberto ? "mobile-open" : ""
          }`}
        >

          <h2 className="sidebar-logo">
            ⚡ Smart Grid
          </h2>

          {/* Dashboard */}

          <button
            onClick={() =>
              navegarPara("dashboard")
            }
            style={sidebarButton(
              aba === "dashboard"
            )}
            className="sidebar-button"
          >
            📊 Dashboard
          </button>

          {/* Equipamentos */}

          <button
            onClick={() =>
              navegarPara("equipamentos")
            }
            style={sidebarButton(
              aba === "equipamentos"
            )}
            className="sidebar-button"
          >
            ⚡ Equipamentos
          </button>

          {/* Monitoramento */}

          <button
            onClick={() =>
              navegarPara("monitoramento")
            }
            style={sidebarButton(
              aba === "monitoramento"
            )}
            className="sidebar-button"
          >
            📈 Monitoramento
          </button>

          {/* Novo equipamento */}

          <button
            onClick={() =>
              navegarPara("novo")
            }
            style={sidebarButton(
              aba === "novo"
            )}
            className="sidebar-button"
          >
            ➕ Novo Equipamento
          </button>

        </div>

        {/* ===================================================
            CONTEÚDO PRINCIPAL
        =================================================== */}

        <div className="dashboard-content">

          {/* =================================================
              TÍTULO
          ================================================= */}

          <h1 className="dashboard-title">
            ⚡ Monitor de Rede Inteligente
          </h1>

          {/* =================================================
              DETALHES DO EQUIPAMENTO
          ================================================= */}

          {equipamentoSelecionado ? (

            <DetalhesEquipamento
              equipamento={equipamentoSelecionado}
              onVoltar={() =>
                setEquipamentoSelecionado(null)
              }
            />

          ) : (

            <>

              {/* =============================================
                  DASHBOARD
              ============================================= */}

              {aba === "dashboard" && (
                <>

                  {/* =========================================
                      CARDS
                  ========================================= */}

                  <div className="dashboard-cards">

                    <StatsCard
                      title="🟢 Online"
                      value={online}
                    />

                    <StatsCard
                      title="🟡 Em Alerta"
                      value={alerta}
                    />

                    <StatsCard
                      title="🔴 Em Falha"
                      value={falha}
                    />

                  </div>

                  {/* =========================================
                      ALERTAS
                  ========================================= */}

                  {totalEmRisco > 0 && (

                    <div className="alert-panel">

                      <div className="alert-header">

                        <div className="alert-header-text">

                          <h2
                            style={{
                              margin: 0,
                              marginBottom: "8px",
                            }}
                          >
                            🚨 Equipamentos que
                            precisam de atenção
                          </h2>

                          <p
                            style={{
                              color: "#9ca3af",
                              margin: 0,
                            }}
                          >
                            Existem{" "}
                            {totalEmRisco}{" "}
                            equipamento(s) em
                            alerta ou falha.
                          </p>

                        </div>

                        <button
                          onClick={() => {
                            setAba("equipamentos");
                            setFiltroStatus("todos");
                          }}
                          style={{
                            background: "#ef4444",
                            color: "white",
                            border: "none",
                            padding: "10px 16px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          Ver equipamentos
                        </button>

                      </div>

                      {/* =====================================
                          LISTA DE EQUIPAMENTOS EM RISCO
                      ===================================== */}

                      <div className="alert-grid">

                        {equipamentosEmRisco.map(
                          (equipamento) => (

                            <div
                              key={equipamento.id}
                              style={{
                                background:
                                  equipamento.status ===
                                  "falha"
                                    ? "#450a0a"
                                    : "#431407",

                                border:
                                  equipamento.status ===
                                  "falha"
                                    ? "1px solid #ef4444"
                                    : "1px solid #f97316",

                                borderRadius: "10px",
                                padding: "15px",
                              }}
                            >

                              {/* Nome + status */}

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent:
                                    "space-between",
                                  alignItems:
                                    "center",
                                  gap: "10px",
                                  marginBottom:
                                    "12px",
                                }}
                              >

                                <strong>
                                  {equipamento.nome}
                                </strong>

                                <span
                                  style={{
                                    fontSize:
                                      "12px",
                                    fontWeight:
                                      "bold",
                                  }}
                                >
                                  {equipamento.status ===
                                  "falha"
                                    ? "🔴 FALHA"
                                    : "🟠 ALERTA"}
                                </span>

                              </div>

                              {/* Temperatura */}

                              <div
                                style={{
                                  color: "#d1d5db",
                                  marginBottom:
                                    "6px",
                                }}
                              >
                                🌡️ Temperatura:{" "}
                                <strong>
                                  {equipamento.temperatura ??
                                    "--"}{" "}
                                  °C
                                </strong>
                              </div>

                              {/* Tensão */}

                              <div
                                style={{
                                  color: "#d1d5db",
                                  marginBottom:
                                    "6px",
                                }}
                              >
                                ⚡ Tensão:{" "}
                                <strong>
                                  {equipamento.tensao ??
                                    "--"}{" "}
                                  kV
                                </strong>
                              </div>

                              {/* Corrente */}

                              <div
                                style={{
                                  color: "#d1d5db",
                                }}
                              >
                                🔌 Corrente:{" "}
                                <strong>
                                  {equipamento.corrente ??
                                    "--"}{" "}
                                  A
                                </strong>
                              </div>

                              {/* Detalhes */}

                              <button
                                onClick={() =>
                                  setEquipamentoSelecionado(
                                    equipamento
                                  )
                                }
                                style={{
                                  marginTop: "15px",
                                  width: "100%",
                                  background:
                                    "#1f2937",
                                  color: "white",
                                  border:
                                    "1px solid #4b5563",
                                  padding: "9px",
                                  borderRadius:
                                    "7px",
                                  cursor:
                                    "pointer",
                                }}
                              >
                                👁️ Ver detalhes
                              </button>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  )}

                  {/* =========================================
                      NÍVEL DE RISCO
                  ========================================= */}

                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: "30px",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    Nível de Risco:

                    {risco === "ALTO" &&
                      " 🔴 ALTO"}

                    {risco === "MÉDIO" &&
                      " 🟡 MÉDIO"}

                    {risco === "BAIXO" &&
                      " 🟢 BAIXO"}
                  </div>

                  {/* =========================================
                      RESUMO DE MANUTENÇÕES
                  ========================================= */}

                  <ResumoManutencoes />

                  {/* =========================================
                      MAPA
                  ========================================= */}

                  <h2
                    style={{
                      textAlign: "center",
                      marginTop: "40px",
                      marginBottom: "20px",
                    }}
                  >
                    🗺️ Mapa da Rede
                  </h2>

                  <GridMap
                    equipamentos={equipamentos}
                  />

                </>
              )}

              {/* =============================================
                  EQUIPAMENTOS
              ============================================= */}

              {aba === "equipamentos" && (
                <>

                  <h2 className="section-title">
                    ⚡ Equipamentos
                  </h2>

                  {/* =========================================
                      BUSCA + FILTRO
                  ========================================= */}

                  <div className="filters-container">

                    <input
                      className="search-input"
                      type="text"
                      placeholder="🔍 Buscar equipamento..."
                      value={busca}
                      onChange={(e) =>
                        setBusca(e.target.value)
                      }
                    />

                    <select
                      className="status-select"
                      value={filtroStatus}
                      onChange={(e) =>
                        setFiltroStatus(
                          e.target.value
                        )
                      }
                    >
                      <option value="todos">
                        Todos
                      </option>

                      <option value="online">
                        Online
                      </option>

                      <option value="alerta">
                        Alerta
                      </option>

                      <option value="falha">
                        Falha
                      </option>
                    </select>

                  </div>

                  {/* =========================================
                      EDITAR
                  ========================================= */}

                  {equipamentoEditando && (

                    <EditarEquipamento
                      equipamento={
                        equipamentoEditando
                      }
                      onClose={() =>
                        setEquipamentoEditando(
                          null
                        )
                      }
                      onAtualizado={
                        carregarEquipamentos
                      }
                    />

                  )}

                  {/* =========================================
                      TABELA
                  ========================================= */}

                  <div className="table-container">

                    <table className="equipment-table">

                      <thead>

                        <tr>

                          <th>
                            Nome
                          </th>

                          <th>
                            Status
                          </th>

                          <th>
                            Temperatura
                          </th>

                          <th>
                            Corrente
                          </th>

                          <th>
                            Tensão
                          </th>

                          <th>
                            Ações
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {equipamentosFiltrados.map(
                          (equipamento) => (

                            <tr
                              key={
                                equipamento.id
                              }
                            >

                              {/* Nome */}

                              <td>
                                {
                                  equipamento.nome
                                }
                              </td>

                              {/* Status */}

                              <td>

                                <span
                                  style={{
                                    background:
                                      getStatusColor(
                                        equipamento.status
                                      ),
                                    color:
                                      "#fff",
                                    padding:
                                      "4px 10px",
                                    borderRadius:
                                      "20px",
                                    fontSize:
                                      "12px",
                                    fontWeight:
                                      "bold",
                                  }}
                                >
                                  {equipamento.status.toUpperCase()}
                                </span>

                              </td>

                              {/* Temperatura */}

                              <td>
                                {
                                  equipamento.temperatura ??
                                  "--"
                                }{" "}
                                °C
                              </td>

                              {/* Corrente */}

                              <td>
                                {
                                  equipamento.corrente ??
                                  "--"
                                }{" "}
                                A
                              </td>

                              {/* Tensão */}

                              <td>
                                {
                                  equipamento.tensao ??
                                  "--"
                                }{" "}
                                kV
                              </td>

                              {/* Ações */}

                              <td>

                                <div className="action-buttons">

                                  {/* VER DETALHES */}

                                  <button
                                    className="action-button"
                                    onClick={() =>
                                      setEquipamentoSelecionado(
                                        equipamento
                                      )
                                    }
                                    style={{
                                      background:
                                        "#8b5cf6",
                                    }}
                                    title="Ver detalhes"
                                  >
                                    👁️
                                  </button>

                                  {/* EDITAR */}

                                  <button
                                    className="action-button"
                                    onClick={() =>
                                      setEquipamentoEditando(
                                        equipamento
                                      )
                                    }
                                    style={{
                                      background:
                                        "#2563eb",
                                    }}
                                    title="Editar"
                                  >
                                    ✏️
                                  </button>

                                  {/* MANUTENÇÃO */}

                                  <button
                                    className="action-button"
                                    onClick={() =>
                                      setEquipamentoSelecionado(
                                        equipamento
                                      )
                                    }
                                    style={{
                                      background:
                                        "#22c55e",
                                    }}
                                    title="Manutenção"
                                  >
                                    🔧
                                  </button>

                                  {/* EXCLUIR */}

                                  <button
                                    className="action-button"
                                    onClick={() =>
                                      excluirEquipamento(
                                        equipamento.id
                                      )
                                    }
                                    style={{
                                      background:
                                        "#ef4444",
                                    }}
                                    title="Excluir"
                                  >
                                    🗑️
                                  </button>

                                </div>

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                  {/* Nenhum equipamento */}

                  {equipamentosFiltrados.length ===
                    0 && (

                    <div
                      style={{
                        textAlign: "center",
                        padding: "40px 20px",
                        color: "#9ca3af",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "40px",
                          marginBottom: "10px",
                        }}
                      >
                        🔍
                      </div>

                      <p>
                        Nenhum equipamento
                        encontrado.
                      </p>
                    </div>

                  )}

                </>
              )}

              {/* =============================================
                  MONITORAMENTO
              ============================================= */}

              {aba === "monitoramento" && (
                <>

                  <h2 className="section-title">
                    📈 Monitoramento
                  </h2>

                  <MetricsChart />

                </>
              )}

              {/* =============================================
                  NOVO EQUIPAMENTO
              ============================================= */}

              {aba === "novo" && (
                <>

                  <NovoEquipamento />

                </>
              )}

            </>

          )}

        </div>

      </div>
    </>
  );
}