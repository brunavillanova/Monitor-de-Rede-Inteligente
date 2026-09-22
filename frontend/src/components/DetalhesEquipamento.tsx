import { useEffect, useState } from "react";
import { api } from "../services/api";

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

interface Manutencao {
  id: number;
  tipo: string;
  responsavel: string;
  descricao: string;
  status: string;
  data: string;
}

interface Props {
  equipamento: Equipamento;
  onVoltar: () => void;
}

export function DetalhesEquipamento({
  equipamento,
  onVoltar,
}: Props) {
  const [manutencoes, setManutencoes] = useState<
    Manutencao[]
  >([]);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [manutencaoEditando, setManutencaoEditando] =
    useState<number | null>(null);

  const [tipo, setTipo] = useState("Preventiva");
  const [responsavel, setResponsavel] = useState("");
  const [descricao, setDescricao] = useState("");
  const [statusManutencao, setStatusManutencao] =
    useState("concluida");

  const [salvando, setSalvando] = useState(false);

  // ==========================================
  // BUSCAR HISTÓRICO
  // ==========================================

async function carregarManutencoes() {
  try {
    const resposta = await api.get(
      `/equipamentos/${equipamento.id}/manutencoes`
    );

    setManutencoes(resposta.data);
  } catch (error) {
    console.error("Erro ao carregar manutenções:", error);
  }
}

useEffect(() => {
  carregarManutencoes();
}, [equipamento.id]);

  // ==========================================
  // LIMPAR FORMULÁRIO
  // ==========================================

  function limparFormulario() {
    setTipo("Preventiva");
    setResponsavel("");
    setDescricao("");
    setStatusManutencao("concluida");
    setManutencaoEditando(null);
    setMostrarFormulario(false);
  }

  // ==========================================
  // ABRIR FORMULÁRIO PARA NOVA MANUTENÇÃO
  // ==========================================

  function novaManutencao() {
    setTipo("Preventiva");
    setResponsavel("");
    setDescricao("");
    setStatusManutencao("concluida");
    setManutencaoEditando(null);

    setMostrarFormulario(true);
  }

  // ==========================================
  // ABRIR EDIÇÃO
  // ==========================================

  function editarManutencao(
    manutencao: Manutencao
  ) {
    setManutencaoEditando(manutencao.id);

    setTipo(manutencao.tipo);
    setResponsavel(manutencao.responsavel);
    setDescricao(manutencao.descricao);
    setStatusManutencao(manutencao.status);

    setMostrarFormulario(true);

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }

  // ==========================================
  // SALVAR / ATUALIZAR MANUTENÇÃO
  // ==========================================

 async function salvarManutencao() {
  if (!responsavel.trim()) {
    alert("Informe o responsável pela manutenção.");
    return;
  }

  if (!descricao.trim()) {
    alert("Informe a descrição da manutenção.");
    return;
  }

  try {
    setSalvando(true);

    const estaEditando = manutencaoEditando !== null;

    if (estaEditando) {
      await api.put(
        `/equipamentos/${equipamento.id}/manutencoes/${manutencaoEditando}`,
        {
          tipo,
          responsavel,
          descricao,
          status: statusManutencao,
        }
      );
    } else {
      await api.post(
        `/equipamentos/${equipamento.id}/manutencoes`,
        {
          tipo,
          responsavel,
          descricao,
          status: statusManutencao,
        }
      );
    }

    alert(
      estaEditando
        ? "Manutenção atualizada com sucesso! 🔧"
        : "Manutenção registrada com sucesso! 🔧"
    );

    limparFormulario();
    await carregarManutencoes();

  } catch (error) {
    console.error(error);

    alert("Não foi possível salvar a manutenção.");

  } finally {
    setSalvando(false);
  }
}

  // ==========================================
  // EXCLUIR MANUTENÇÃO
  // ==========================================

async function excluirManutencao(
  manutencaoId: number
) {
  const confirmar = window.confirm(
    "Deseja realmente excluir esta manutenção?"
  );

  if (!confirmar) {
    return;
  }

  try {
    await api.delete(
      `/equipamentos/${equipamento.id}/manutencoes/${manutencaoId}`
    );

    alert("Manutenção excluída com sucesso.");

    await carregarManutencoes();

  } catch (error) {
    console.error(error);

    alert(
      "Não foi possível excluir a manutenção."
    );
  }
}

  // ==========================================
  // STATUS DO EQUIPAMENTO
  // ==========================================

  function getStatusColor(status: string) {
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
  }

  function getStatusText(status: string) {
    switch (status) {
      case "online":
        return "ONLINE";

      case "alerta":
        return "EM ALERTA";

      case "falha":
        return "EM FALHA";

      default:
        return status.toUpperCase();
    }
  }

  // ==========================================
  // ESTILO DOS CARDS
  // ==========================================

  const cardStyle = {
    background: "#111827",
    border: "1px solid #374151",
    borderRadius: "12px",
    padding: "25px",
    textAlign: "center" as const,
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      {/* VOLTAR */}

      <button
        onClick={onVoltar}
        style={{
          background: "#1f2937",
          color: "white",
          border: "1px solid #374151",
          borderRadius: "8px",
          padding: "10px 18px",
          cursor: "pointer",
          marginBottom: "25px",
          fontSize: "14px",
        }}
      >
        ← Voltar
      </button>

      {/* CABEÇALHO */}

      <div
        style={{
          background: "#111827",
          border: "1px solid #374151",
          borderRadius: "12px",
          padding: "25px",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>
              ⚡ {equipamento.nome}
            </h2>

            <p
              style={{
                marginTop: "8px",
                color: "#9ca3af",
              }}
            >
              Monitoramento do equipamento
            </p>
          </div>

          <span
            style={{
              background: getStatusColor(
                equipamento.status
              ),
              color: "white",
              padding: "8px 16px",
              borderRadius: "20px",
              fontWeight: "bold",
              fontSize: "13px",
            }}
          >
            {getStatusText(equipamento.status)}
          </span>
        </div>
      </div>

      {/* INDICADORES */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        <div style={cardStyle}>
          <div style={{ fontSize: "30px" }}>
            🌡️
          </div>

          <p
            style={{
              color: "#9ca3af",
              marginBottom: "5px",
            }}
          >
            Temperatura
          </p>

          <strong style={{ fontSize: "30px" }}>
            {equipamento.temperatura ?? "--"} °C
          </strong>
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: "30px" }}>
            ⚡
          </div>

          <p
            style={{
              color: "#9ca3af",
              marginBottom: "5px",
            }}
          >
            Tensão
          </p>

          <strong style={{ fontSize: "30px" }}>
            {equipamento.tensao ?? "--"} kV
          </strong>
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: "30px" }}>
            🔌
          </div>

          <p
            style={{
              color: "#9ca3af",
              marginBottom: "5px",
            }}
          >
            Corrente
          </p>

          <strong style={{ fontSize: "30px" }}>
            {equipamento.corrente ?? "--"} A
          </strong>
        </div>
      </div>

      {/* INFORMAÇÕES */}

      <div
        style={{
          background: "#111827",
          border: "1px solid #374151",
          borderRadius: "12px",
          padding: "25px",
          marginBottom: "25px",
        }}
      >
        <h3>📍 Informações do equipamento</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <div>
            <span style={{ color: "#9ca3af" }}>
              Identificação
            </span>

            <p style={{ fontWeight: "bold" }}>
              #{equipamento.id}
            </p>
          </div>

          <div>
            <span style={{ color: "#9ca3af" }}>
              Nome
            </span>

            <p style={{ fontWeight: "bold" }}>
              {equipamento.nome}
            </p>
          </div>

          <div>
            <span style={{ color: "#9ca3af" }}>
              Latitude
            </span>

            <p style={{ fontWeight: "bold" }}>
              {equipamento.latitude}
            </p>
          </div>

          <div>
            <span style={{ color: "#9ca3af" }}>
              Longitude
            </span>

            <p style={{ fontWeight: "bold" }}>
              {equipamento.longitude}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* MANUTENÇÃO */}
      {/* ========================================== */}

      <div
        style={{
          background: "#111827",
          border: "1px solid #374151",
          borderRadius: "12px",
          padding: "25px",
        }}
      >
        {/* CABEÇALHO DA MANUTENÇÃO */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div>
            <h3>🔧 Manutenção</h3>

            <p
              style={{
                color: "#9ca3af",
              }}
            >
              Histórico de manutenção deste
              equipamento.
            </p>
          </div>

          <button
            onClick={novaManutencao}
            style={{
              background: "#22c55e",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 20px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🔧 Registrar manutenção
          </button>
        </div>

        {/* ========================================== */}
        {/* FORMULÁRIO */}
        {/* ========================================== */}

        {mostrarFormulario && (
          <div
            style={{
              marginTop: "25px",
              padding: "20px",
              background: "#1f2937",
              borderRadius: "10px",
              border: "1px solid #374151",
            }}
          >
            <h3>
              {manutencaoEditando !== null
                ? "✏️ Editar manutenção"
                : "🔧 Nova manutenção"}
            </h3>

            {/* TIPO */}

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  color: "#d1d5db",
                }}
              >
                Tipo de manutenção
              </label>

              <select
                value={tipo}
                onChange={(e) =>
                  setTipo(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #4b5563",
                  background: "#111827",
                  color: "white",
                  boxSizing: "border-box",
                }}
              >
                <option value="Preventiva">
                  Preventiva
                </option>

                <option value="Corretiva">
                  Corretiva
                </option>

                <option value="Inspeção">
                  Inspeção
                </option>

                <option value="Emergencial">
                  Emergencial
                </option>
              </select>
            </div>

            {/* RESPONSÁVEL */}

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  color: "#d1d5db",
                }}
              >
                Responsável
              </label>

              <input
                type="text"
                value={responsavel}
                onChange={(e) =>
                  setResponsavel(e.target.value)
                }
                placeholder="Nome do responsável"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #4b5563",
                  background: "#111827",
                  color: "white",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* STATUS */}

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  color: "#d1d5db",
                }}
              >
                Status
              </label>

              <select
                value={statusManutencao}
                onChange={(e) =>
                  setStatusManutencao(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #4b5563",
                  background: "#111827",
                  color: "white",
                  boxSizing: "border-box",
                }}
              >
                <option value="concluida">
                  Concluída
                </option>

                <option value="em_andamento">
                  Em andamento
                </option>

                <option value="pendente">
                  Pendente
                </option>
              </select>
            </div>

            {/* DESCRIÇÃO */}

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  color: "#d1d5db",
                }}
              >
                Descrição
              </label>

              <textarea
                value={descricao}
                onChange={(e) =>
                  setDescricao(e.target.value)
                }
                placeholder="Descreva o serviço realizado..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #4b5563",
                  background: "#111827",
                  color: "white",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* BOTÕES */}

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={limparFormulario}
                style={{
                  background: "#374151",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 18px",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>

              <button
                onClick={salvarManutencao}
                disabled={salvando}
                style={{
                  background: "#22c55e",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 18px",
                  cursor: salvando
                    ? "not-allowed"
                    : "pointer",
                  fontWeight: "bold",
                  opacity: salvando ? 0.6 : 1,
                }}
              >
                {salvando
                  ? "Salvando..."
                  : manutencaoEditando !== null
                  ? "Salvar alterações"
                  : "Salvar manutenção"}
              </button>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* HISTÓRICO */}
        {/* ========================================== */}

        <div style={{ marginTop: "30px" }}>
          <h3>📋 Histórico</h3>

          {manutencoes.length === 0 ? (
            <div
              style={{
                padding: "25px",
                background: "#1f2937",
                borderRadius: "10px",
                color: "#9ca3af",
                textAlign: "center",
              }}
            >
              Nenhuma manutenção registrada
              para este equipamento.
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              {manutencoes.map((manutencao) => (
                <div
                  key={manutencao.id}
                  style={{
                    background: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "10px",
                    padding: "20px",
                  }}
                >
                  {/* TOPO DO CARD */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <strong>
                      🔧 {manutencao.tipo}
                    </strong>

                    <span
                      style={{
                        background:
                          manutencao.status ===
                          "concluida"
                            ? "#22c55e"
                            : manutencao.status ===
                              "em_andamento"
                            ? "#eab308"
                            : "#6b7280",
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "15px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {manutencao.status ===
                      "em_andamento"
                        ? "EM ANDAMENTO"
                        : manutencao.status.toUpperCase()}
                    </span>
                  </div>

                  {/* RESPONSÁVEL */}

                  <p
                    style={{
                      color: "#d1d5db",
                      marginBottom: "8px",
                    }}
                  >
                    <strong>
                      Responsável:
                    </strong>{" "}
                    {manutencao.responsavel}
                  </p>

                  {/* DESCRIÇÃO */}

                  <p
                    style={{
                      color: "#9ca3af",
                    }}
                  >
                    {manutencao.descricao}
                  </p>

                  {/* DATA */}

                  <small
                    style={{
                      color: "#6b7280",
                    }}
                  >
                    📅{" "}
                    {new Date(
                      manutencao.data
                    ).toLocaleString("pt-BR")}
                  </small>

                  {/* ================================= */}
                  {/* BOTÕES EDITAR / EXCLUIR */}
                  {/* ================================= */}

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "flex-end",
                      marginTop: "15px",
                    }}
                  >
                    <button
                      onClick={() =>
                        editarManutencao(
                          manutencao
                        )
                      }
                      style={{
                        background: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: "7px",
                        padding: "8px 14px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      ✏️ Editar
                    </button>

                    <button
                      onClick={() =>
                        excluirManutencao(
                          manutencao.id
                        )
                      }
                      style={{
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "7px",
                        padding: "8px 14px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}