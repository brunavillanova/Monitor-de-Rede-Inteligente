
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { api } from "../services/api";

interface Manutencao {
  id: number;
  tipo: string;
  responsavel: string;
  descricao: string;
  status: string;
  data: string;
  equipamentoId: number;
  equipamento: {
    id: number;
    nome: string;
  };
}

export function ResumoManutencoes() {
  const [manutencoes, setManutencoes] = useState<
    Manutencao[]
  >([]);

  useEffect(() => {
    carregarManutencoes();
  }, []);

async function carregarManutencoes() {
  try {
    const resposta = await api.get("/manutencoes");

    const dados = resposta.data;

    setManutencoes(dados);
  } catch (error) {
    console.error(
      "Erro ao carregar manutenções:",
      error
    );
  }
}

  const total = manutencoes.length;

  const concluidas = manutencoes.filter(
    (m) => m.status === "concluida"
  ).length;

  const andamento = manutencoes.filter(
    (m) => m.status === "em_andamento"
  ).length;

  const pendentes = manutencoes.filter(
    (m) => m.status === "pendente"
  ).length;

  const dadosGrafico = [
    {
      nome: "Concluídas",
      quantidade: concluidas,
    },
    {
      nome: "Em andamento",
      quantidade: andamento,
    },
    {
      nome: "Pendentes",
      quantidade: pendentes,
    },
  ];

  const ultimasManutencoes =
    manutencoes.slice(0, 5);

  function formatarStatus(status: string) {
    switch (status) {
      case "concluida":
        return "CONCLUÍDA";

      case "em_andamento":
        return "EM ANDAMENTO";

      case "pendente":
        return "PENDENTE";

      default:
        return status.toUpperCase();
    }
  }

  function formatarData(data: string) {
    return new Date(data).toLocaleDateString(
      "pt-BR"
    );
  }

  return (
    <div
      style={{
        marginTop: "25px",
        width: "100%",
      }}
    >
      {/* ====================================== */}
      {/* TÍTULO */}
      {/* ====================================== */}

      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            margin: 0,
          }}
        >
          🔧 Manutenções
        </h2>

        <p
          style={{
            color: "#9ca3af",
            marginTop: "6px",
          }}
        >
          Resumo das manutenções dos equipamentos.
        </p>
      </div>

      {/* ====================================== */}
      {/* CARDS */}
      {/* ====================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        {/* TOTAL */}

        <div
          style={{
            background: "#111827",
            border: "1px solid #374151",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontSize: "28px",
            }}
          >
            🔧
          </div>

          <p
            style={{
              color: "#9ca3af",
              margin: "8px 0",
            }}
          >
            Total
          </p>

          <strong
            style={{
              fontSize: "30px",
            }}
          >
            {total}
          </strong>
        </div>

        {/* CONCLUÍDAS */}

        <div
          style={{
            background: "#111827",
            border: "1px solid #374151",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontSize: "28px",
            }}
          >
            ✅
          </div>

          <p
            style={{
              color: "#9ca3af",
              margin: "8px 0",
            }}
          >
            Concluídas
          </p>

          <strong
            style={{
              fontSize: "30px",
              color: "#22c55e",
            }}
          >
            {concluidas}
          </strong>
        </div>

        {/* EM ANDAMENTO */}

        <div
          style={{
            background: "#111827",
            border: "1px solid #374151",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontSize: "28px",
            }}
          >
            🟡
          </div>

          <p
            style={{
              color: "#9ca3af",
              margin: "8px 0",
            }}
          >
            Em andamento
          </p>

          <strong
            style={{
              fontSize: "30px",
              color: "#eab308",
            }}
          >
            {andamento}
          </strong>
        </div>

        {/* PENDENTES */}

        <div
          style={{
            background: "#111827",
            border: "1px solid #374151",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontSize: "28px",
            }}
          >
            ⏳
          </div>

          <p
            style={{
              color: "#9ca3af",
              margin: "8px 0",
            }}
          >
            Pendentes
          </p>

          <strong
            style={{
              fontSize: "30px",
              color: "#ef4444",
            }}
          >
            {pendentes}
          </strong>
        </div>
      </div>

      {/* ====================================== */}
      {/* GRÁFICO */}
      {/* ====================================== */}

      <div
        style={{
          background: "#111827",
          border: "1px solid #374151",
          borderRadius: "12px",
          padding: "25px",
          marginBottom: "25px",
        }}
      >
        <h3
          style={{
            marginTop: 0,
          }}
        >
          📊 Status das manutenções
        </h3>

        <div
          style={{
            width: "100%",
            height: "300px",
          }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="nome" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Bar
                dataKey="quantidade"
                fill="#22c55e"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ====================================== */}
      {/* ÚLTIMAS MANUTENÇÕES */}
      {/* ====================================== */}

      <div
        style={{
          background: "#111827",
          border: "1px solid #374151",
          borderRadius: "12px",
          padding: "25px",
        }}
      >
        <h3
          style={{
            marginTop: 0,
          }}
        >
          📋 Últimas manutenções
        </h3>

        {ultimasManutencoes.length === 0 ? (
          <div
            style={{
              padding: "25px",
              textAlign: "center",
              color: "#9ca3af",
              background: "#1f2937",
              borderRadius: "10px",
            }}
          >
            Nenhuma manutenção registrada.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {ultimasManutencoes.map(
              (manutencao) => (
                <div
                  key={manutencao.id}
                  style={{
                    background: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "10px",
                    padding: "18px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <strong>
                        🔧 {manutencao.tipo}
                      </strong>

                      <p
                        style={{
                          margin:
                            "7px 0 0 0",
                          color: "#d1d5db",
                        }}
                      >
                        {manutencao.equipamento
                          ?.nome ||
                          `Equipamento #${manutencao.equipamentoId}`}
                      </p>
                    </div>

                    <span
                      style={{
                        background:
                          manutencao.status ===
                          "concluida"
                            ? "#22c55e"
                            : manutencao.status ===
                              "em_andamento"
                            ? "#eab308"
                            : "#ef4444",
                        color: "white",
                        padding: "6px 10px",
                        borderRadius: "15px",
                        fontSize: "11px",
                        fontWeight: "bold",
                      }}
                    >
                      {formatarStatus(
                        manutencao.status
                      )}
                    </span>
                  </div>

                  <p
                    style={{
                      color: "#9ca3af",
                      margin:
                        "12px 0 6px 0",
                    }}
                  >
                    <strong>
                      Responsável:
                    </strong>{" "}
                    {manutencao.responsavel}
                  </p>

                  <p
                    style={{
                      color: "#9ca3af",
                      margin: 0,
                    }}
                  >
                    {manutencao.descricao}
                  </p>

                  <small
                    style={{
                      display: "block",
                      marginTop: "10px",
                      color: "#6b7280",
                    }}
                  >
                    📅{" "}
                    {formatarData(
                      manutencao.data
                    )}
                  </small>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}