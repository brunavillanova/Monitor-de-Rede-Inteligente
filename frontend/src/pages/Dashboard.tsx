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
  // ============================
  // States
  // ============================

  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);

  const [aba, setAba] = useState("dashboard");

  const [busca, setBusca] = useState("");

  const [filtroStatus, setFiltroStatus] =
    useState("todos");

  const [equipamentoEditando, setEquipamentoEditando] =
    useState<Equipamento | null>(null);

  const [equipamentoSelecionado, setEquipamentoSelecionado] =
    useState<Equipamento | null>(null);

  // ============================
  // Carregar equipamentos
  // ============================

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

  // ============================
  // Excluir equipamento
  // ============================

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

  // ============================
  // Editar equipamento
  // ============================

  async function editarEquipamento(
    equipamento: Equipamento
  ) {
    const novoNome = window.prompt(
      "Novo nome:",
      equipamento.nome
    );

    if (!novoNome) return;

    try {
      await api.put(
        `/equipamentos/${equipamento.id}`,
        {
          ...equipamento,
          nome: novoNome,
        }
      );

      await carregarEquipamentos();

      alert("Equipamento atualizado!");
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar equipamento");
    }
  }

  // ============================
  // Estatísticas
  // ============================

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

  // ============================
  // EQUIPAMENTOS EM RISCO
  // ============================

  const equipamentosEmRisco = equipamentos.filter(
    (equipamento) =>
      equipamento.status === "alerta" ||
      equipamento.status === "falha"
  );

  const totalEmRisco = equipamentosEmRisco.length;

  // ============================
  // Estilo dos botões da sidebar
  // ============================

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
  });

  // ============================
  // Cor do status
  // ============================

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

  // ============================
  // Filtros
  // ============================

  const equipamentosFiltrados =
    equipamentos.filter((equipamento) => {
      const matchNome = equipamento.nome
        .toLowerCase()
        .includes(busca.toLowerCase());

      const matchStatus =
        filtroStatus === "todos"
          ? true
          : equipamento.status === filtroStatus;

      return matchNome && matchStatus;
    });

  // ============================
  // Tela
  // ============================

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        background: "#0f172a",
        color: "white",
      }}
    >
      {/* ============================
          SIDEBAR
      ============================ */}

      <div
        style={{
          width: "260px",
          minHeight: "100vh",
          background: "#111827",
          padding: "20px",
          borderRight: "1px solid #374151",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <h2
          style={{
            marginBottom: "30px",
          }}
        >
          ⚡ Smart Grid
        </h2>

        <button
          onClick={() => {
            setAba("dashboard");
            setEquipamentoSelecionado(null);
          }}
          style={sidebarButton(
            aba === "dashboard"
          )}
        >
          📊 Dashboard
        </button>

        <button
          onClick={() => {
            setAba("equipamentos");
            setEquipamentoSelecionado(null);
          }}
          style={sidebarButton(
            aba === "equipamentos"
          )}
        >
          ⚡ Equipamentos
        </button>

        <button
          onClick={() => {
            setAba("monitoramento");
            setEquipamentoSelecionado(null);
          }}
          style={sidebarButton(
            aba === "monitoramento"
          )}
        >
          📈 Monitoramento
        </button>

        <button
          onClick={() => {
            setAba("novo");
            setEquipamentoSelecionado(null);
          }}
          style={sidebarButton(aba === "novo")}
        >
          ➕ Novo Equipamento
        </button>
      </div>

      {/* ============================
          CONTEÚDO PRINCIPAL
      ============================ */}

      <div
        style={{
          flex: 1,
          minWidth: 0,
          padding: "30px",
          boxSizing: "border-box",
        }}
      >
        {/* Título */}

        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "48px",
            wordBreak: "break-word",
          }}
        >
          ⚡ Monitor de Rede Inteligente
        </h1>

        {/* ============================
            DETALHES DO EQUIPAMENTO
        ============================ */}

        {equipamentoSelecionado ? (
          <DetalhesEquipamento
            equipamento={equipamentoSelecionado}
            onVoltar={() =>
              setEquipamentoSelecionado(null)
            }
          />
        ) : (
          <>
            {/* ============================
                DASHBOARD
            ============================ */}

            {aba === "dashboard" && (
              <>
                {/* ============================
                    CARDS DOS EQUIPAMENTOS
                ============================ */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                    marginBottom: "40px",
                    flexWrap: "wrap",
                  }}
                >
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

                {/* ============================
                    ALERTAS DE EQUIPAMENTOS
                ============================ */}

                {totalEmRisco > 0 && (
                  <div
                    style={{
                      background: "#111827",
                      border: "1px solid #374151",
                      borderRadius: "12px",
                      padding: "20px",
                      marginBottom: "30px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "20px",
                        marginBottom: "20px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <h2
                          style={{
                            margin: 0,
                            marginBottom: "8px",
                          }}
                        >
                          🚨 Equipamentos que precisam de atenção
                        </h2>

                        <p
                          style={{
                            color: "#9ca3af",
                            margin: 0,
                          }}
                        >
                          Existem {totalEmRisco} equipamento(s)
                          em alerta ou falha.
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

                    {/* Lista dos equipamentos em risco */}

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "15px",
                      }}
                    >
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
                            {/* Nome + Status */}

                            <div
                              style={{
                                display: "flex",
                                justifyContent:
                                  "space-between",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "12px",
                              }}
                            >
                              <strong>
                                {equipamento.nome}
                              </strong>

                              <span
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "bold",
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
                                marginBottom: "6px",
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
                                marginBottom: "6px",
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

                            {/* Botão detalhes */}

                            <button
                              onClick={() =>
                                setEquipamentoSelecionado(
                                  equipamento
                                )
                              }
                              style={{
                                marginTop: "15px",
                                width: "100%",
                                background: "#1f2937",
                                color: "white",
                                border:
                                  "1px solid #4b5563",
                                padding: "9px",
                                borderRadius: "7px",
                                cursor: "pointer",
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

                {/* ============================
                    NÍVEL DE RISCO
                ============================ */}

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

                {/* ============================
                    RESUMO DE MANUTENÇÕES
                ============================ */}

                <ResumoManutencoes />

                {/* ============================
                    MAPA
                ============================ */}

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

            {/* ============================
                EQUIPAMENTOS
            ============================ */}

            {aba === "equipamentos" && (
              <>
                <h2
                  style={{
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
                  ⚡ Equipamentos
                </h2>

                {/* Busca e filtro */}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "20px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="🔍 Buscar equipamento..."
                    value={busca}
                    onChange={(e) =>
                      setBusca(e.target.value)
                    }
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "8px",
                      border:
                        "1px solid #374151",
                      background: "#111827",
                      color: "white",
                    }}
                  />

                  <select
                    value={filtroStatus}
                    onChange={(e) =>
                      setFiltroStatus(
                        e.target.value
                      )
                    }
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border:
                        "1px solid #374151",
                      background: "#111827",
                      color: "white",
                    }}
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

                {/* Editar */}

                {equipamentoEditando && (
                  <EditarEquipamento
                    equipamento={
                      equipamentoEditando
                    }
                    onClose={() =>
                      setEquipamentoEditando(null)
                    }
                    onAtualizado={
                      carregarEquipamentos
                    }
                  />
                )}

                {/* Tabela */}

                <div
                  style={{
                    width: "100%",
                    overflowX: "auto",
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse:
                        "collapse",
                      background: "#111827",
                      borderRadius: "12px",
                      overflow: "hidden",
                      minWidth: "900px",
                    }}
                  >
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Status</th>
                        <th>Temperatura</th>
                        <th>Corrente</th>
                        <th>Tensão</th>
                        <th>Ações</th>
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
                            <td>
                              {
                                equipamento.nome
                              }
                            </td>

                            <td>
                              <span
                                style={{
                                  background:
                                    getStatusColor(
                                      equipamento.status
                                    ),
                                  color: "#fff",
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

                            <td>
                              {
                                equipamento.temperatura
                              }{" "}
                              °C
                            </td>

                            <td>
                              {
                                equipamento.corrente
                              }{" "}
                              A
                            </td>

                            <td>
                              {
                                equipamento.tensao
                              }{" "}
                              kV
                            </td>

                            {/* AÇÕES */}

                            <td
                              style={{
                                display: "flex",
                                gap: "8px",
                                padding: "10px",
                              }}
                            >
                              {/* VER DETALHES */}

                              <button
                                onClick={() =>
                                  setEquipamentoSelecionado(
                                    equipamento
                                  )
                                }
                                style={{
                                  background:
                                    "#8b5cf6",
                                  color:
                                    "white",
                                  border: "none",
                                  borderRadius:
                                    "6px",
                                  padding:
                                    "6px 10px",
                                  cursor:
                                    "pointer",
                                }}
                                title="Ver detalhes"
                              >
                                👁️
                              </button>

                              {/* EDITAR */}

                              <button
                                onClick={() =>
                                  setEquipamentoEditando(
                                    equipamento
                                  )
                                }
                                style={{
                                  background:
                                    "#2563eb",
                                  color:
                                    "white",
                                  border: "none",
                                  borderRadius:
                                    "6px",
                                  padding:
                                    "6px 10px",
                                  cursor:
                                    "pointer",
                                }}
                                title="Editar"
                              >
                                ✏️
                              </button>

                              {/* MANUTENÇÃO */}

                              <button
                                onClick={() =>
                                  setEquipamentoSelecionado(
                                    equipamento
                                  )
                                }
                                style={{
                                  background:
                                    "#22c55e",
                                  color:
                                    "white",
                                  border: "none",
                                  padding:
                                    "8px 10px",
                                  borderRadius:
                                    "6px",
                                  cursor:
                                    "pointer",
                                }}
                                title="Manutenção"
                              >
                                🔧
                              </button>

                              {/* EXCLUIR */}

                              <button
                                onClick={() =>
                                  excluirEquipamento(
                                    equipamento.id
                                  )
                                }
                                style={{
                                  background:
                                    "#ef4444",
                                  color:
                                    "white",
                                  border: "none",
                                  borderRadius:
                                    "6px",
                                  padding:
                                    "6px 10px",
                                  cursor:
                                    "pointer",
                                }}
                                title="Excluir"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ============================
                MONITORAMENTO
            ============================ */}

            {aba === "monitoramento" && (
              <>
                <h2
                  style={{
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
                  📈 Monitoramento
                </h2>

                <MetricsChart />
              </>
            )}

            {/* ============================
                NOVO EQUIPAMENTO
            ============================ */}

            {aba === "novo" && (
              <>
                <NovoEquipamento />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}