import { useEffect, useState } from "react";
import { api } from "../services/api";
import { StatsCard } from "../components/StatsCard";
import { GridMap } from "../components/GridMap";
import { MetricsChart } from "../components/MetricsChart";
import { NovoEquipamento } from "../components/NovoEquipamento";
import { EditarEquipamento } from "../components/EditarEquipamento";


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
// ============================
// States
// ============================

export function Dashboard() {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [aba, setAba] = useState("dashboard");
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [equipamentoEditando, setEquipamentoEditando] =
  useState<Equipamento | null>(null);

  useEffect(() => {
    carregarEquipamentos();
  }, []);

  async function carregarEquipamentos() {
    const response = await api.get("/equipamentos");
    setEquipamentos(response.data);
  }

  async function registrarManutencao(id: number) {
    try {
      await api.put(`/equipamentos/${id}/manutencao`);

      await carregarEquipamentos();

      alert("🔧 Manutenção registrada com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao registrar manutenção");
    }
  }
  

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

async function editarEquipamento(
  equipamento: Equipamento
) {
  const novoNome = window.prompt(
    "Novo nome:",
    equipamento.nome
  );

  if (!novoNome) return;

  try {
    await api.put(`/equipamentos/${equipamento.id}`, {
      ...equipamento,
      nome: novoNome,
    });

    carregarEquipamentos();

    alert("Equipamento atualizado!");
  } catch (error) {
    console.error(error);
    alert("Erro ao atualizar equipamento");
  }
}

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
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          background: "#111827",
          padding: "20px",
         borderRight: "1px solid #374151",
        }}
      >

        
        <h2 style={{ marginBottom: "30px" }}>
          ⚡ Smart Grid
        </h2>

        <button
          onClick={() => setAba("dashboard")}
          style={sidebarButton(aba === "dashboard")}
        >
          📊 Dashboard
        </button>

        <button
          onClick={() => setAba("equipamentos")}
          style={sidebarButton(aba === "equipamentos")}
        >
          ⚡ Equipamentos
        </button>

        <button
          onClick={() => setAba("monitoramento")}
          style={sidebarButton(aba === "monitoramento")}
        >
          📈 Monitoramento
        </button>

        <button
          onClick={() => setAba("novo")}
          style={sidebarButton(aba === "novo")}
        >
          ➕ Novo Equipamento
        </button>
      </div>

      {/* Conteúdo */}
      <div
        style={{
          flex: 1,
          padding: "30px",
        }}
      >
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

        {aba === "dashboard" && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                marginBottom: "40px",
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

            <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          Nível de Risco:
          {risco === "ALTO" && " 🔴 ALTO"}
          {risco === "MÉDIO" && " 🟡 MÉDIO"}
          {risco === "BAIXO" && " 🟢 BAIXO"}
        </div>

            <h2
              style={{
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              🗺️ Mapa da Rede
            </h2>

            <GridMap equipamentos={equipamentos} />
          </>
        )}

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
    onChange={(e) => setBusca(e.target.value)}
    style={{
      flex: 1,
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #374151",
      background: "#111827",
      color: "white",
    }}
  />


  <select
    value={filtroStatus}
    onChange={(e) => setFiltroStatus(e.target.value)}
    style={{
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #374151",
      background: "#111827",
      color: "white",
    }}
  >
    <option value="todos">Todos</option>
    <option value="online">Online</option>
    <option value="alerta">Alerta</option>
    <option value="falha">Falha</option>
  </select>

  
</div>
{equipamentoEditando && (
  <EditarEquipamento
    equipamento={equipamentoEditando}
    onClose={() => setEquipamentoEditando(null)}
    onAtualizado={carregarEquipamentos}
  />
)}


            
<table
  style={{
    width: "100%",
    borderCollapse: "collapse",
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
    {equipamentosFiltrados.map((equipamento) => (
      <tr key={equipamento.id}>
        <td>{equipamento.nome}</td>

      <td>
  <span
    style={{
      background: getStatusColor(equipamento.status),
      color: "#fff",
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "bold",
    }}
  >
    {equipamento.status.toUpperCase()}
  </span>
</td>

        <td>{equipamento.temperatura} °C</td>
        <td>{equipamento.corrente} A</td>
        <td>{equipamento.tensao} kV</td>

        <td
  style={{
    display: "flex",
    gap: "8px",
    padding: "10px",
  }}
>
<button
  onClick={() =>
    setEquipamentoEditando(equipamento)
  }
  style={{
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "6px 10px",
    cursor: "pointer",
  }}
>
  ✏️
</button>

  <button
    onClick={() =>
      registrarManutencao(equipamento.id)
    }
    style={{
      background: "#22c55e",
      color: "white",
      border: "none",
      borderRadius: "6px",
      padding: "6px 10px",
      cursor: "pointer",
    }}
  >
    🔧
  </button>

<button
  onClick={() =>
    excluirEquipamento(equipamento.id)
  }
  style={{
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "6px 10px",
    cursor: "pointer",
  }}
>
  🗑️
</button>
</td>
      </tr>
    ))}
  </tbody>
</table>
          </>
        )}

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

        {aba === "novo" && (
          <>
            <NovoEquipamento />
          </>
        )}
      </div>
    </div>
  );
}