import { useState } from "react";

import { api } from "../services/api";

export function NovoEquipamento() {
  // ============================
  // States dos campos
  // ============================

  const [nome, setNome] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [tensao, setTensao] = useState("");
  const [corrente, setCorrente] = useState("");
  const [temperatura, setTemperatura] = useState("");

  // ============================
  // Estilo dos inputs
  // ============================

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #374151",
    background: "#1f2937",
    color: "white",
    fontSize: "14px",
    boxSizing: "border-box" as const,
    outline: "none",
  };

  // ============================
  // Estilo das descrições
  // ============================

  const descriptionStyle = {
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "4px",
    marginBottom: "2px",
  };

  // ============================
  // Salvar equipamento
  // ============================

  async function salvar() {
    try {
      let status = "online";

      const temperaturaNum = Number(temperatura);

      // Define status automaticamente pela temperatura

      if (temperaturaNum >= 70) {
        status = "falha";
      } else if (temperaturaNum >= 50) {
        status = "alerta";
      }

      await api.post("/equipamentos", {
        nome,
        latitude: Number(latitude),
        longitude: Number(longitude),
        status,
        tensao: Number(tensao),
        corrente: Number(corrente),
        temperatura: Number(temperatura),
      });

      alert("✅ Equipamento cadastrado com sucesso!");

      // Limpar formulário

      setNome("");
      setLatitude("");
      setLongitude("");
      setTensao("");
      setCorrente("");
      setTemperatura("");

      // Atualiza a tela

      window.location.reload();
    } catch (error) {
      console.error(error);

      alert("❌ Erro ao cadastrar equipamento");
    }
  }

  // ============================
  // Render da tela
  // ============================

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "700px",
        margin: "0 auto",
        background: "#111827",
        padding: "30px",
        borderRadius: "12px",
        border: "1px solid #374151",
        boxSizing: "border-box",
      }}
    >
      {/* ============================
          TÍTULO
      ============================ */}

      <h2
        style={{
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        ➕ Novo Equipamento
      </h2>

      {/* ============================
          CAMPOS
      ============================ */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "15px",
        }}
      >
        {/* ============================
            NOME
        ============================ */}

        <div>
          <label
            style={{
              display: "block",
              color: "white",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            Nome do equipamento
          </label>

          <p style={descriptionStyle}>
            🏷️ Identificação do equipamento na rede.
          </p>

          <input
            placeholder="Ex: Transformador T-003"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
            style={inputStyle}
          />
        </div>

        {/* ============================
            LATITUDE
        ============================ */}

        <div>
          <label
            style={{
              display: "block",
              color: "white",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            Latitude
          </label>

          <p style={descriptionStyle}>
            📍 Latitude da localização do equipamento.
          </p>

          <input
            type="number"
            step="any"
            placeholder="Ex: -23.32"
            value={latitude}
            onChange={(e) =>
              setLatitude(e.target.value)
            }
            style={inputStyle}
          />
        </div>

        {/* ============================
            LONGITUDE
        ============================ */}

        <div>
          <label
            style={{
              display: "block",
              color: "white",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            Longitude
          </label>

          <p style={descriptionStyle}>
            📍 Longitude da localização do equipamento.
          </p>

          <input
            type="number"
            step="any"
            placeholder="Ex: -46.75"
            value={longitude}
            onChange={(e) =>
              setLongitude(e.target.value)
            }
            style={inputStyle}
          />
        </div>

        {/* ============================
            TENSÃO
        ============================ */}

        <div>
          <label
            style={{
              display: "block",
              color: "white",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            Tensão (kV)
          </label>

          <p style={descriptionStyle}>
            ⚡ Tensão elétrica medida no equipamento.
          </p>

          <input
            type="number"
            step="any"
            placeholder="Ex: 11.9"
            value={tensao}
            onChange={(e) =>
              setTensao(e.target.value)
            }
            style={inputStyle}
          />
        </div>

        {/* ============================
            CORRENTE
        ============================ */}

        <div>
          <label
            style={{
              display: "block",
              color: "white",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            Corrente (A)
          </label>

          <p style={descriptionStyle}>
            🔌 Corrente elétrica medida no equipamento.
          </p>

          <input
            type="number"
            step="any"
            placeholder="Ex: 240"
            value={corrente}
            onChange={(e) =>
              setCorrente(e.target.value)
            }
            style={inputStyle}
          />
        </div>

        {/* ============================
            TEMPERATURA
        ============================ */}

        <div>
          <label
            style={{
              display: "block",
              color: "white",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            Temperatura (°C)
          </label>

          <p style={descriptionStyle}>
            🌡️ Temperatura atual do equipamento.
          </p>

          <input
            type="number"
            step="any"
            placeholder="Ex: 42"
            value={temperatura}
            onChange={(e) =>
              setTemperatura(e.target.value)
            }
            style={{
              ...inputStyle,
              border:
                temperatura === ""
                  ? "1px solid #374151"
                  : Number(temperatura) >= 70
                  ? "1px solid #ef4444"
                  : Number(temperatura) >= 50
                  ? "1px solid #eab308"
                  : "1px solid #22c55e",
            }}
          />

          {/* Indicador automático */}

          {temperatura !== "" && (
            <div
              style={{
                marginTop: "8px",
                padding: "9px",
                borderRadius: "8px",
                background:
                  Number(temperatura) >= 70
                    ? "rgba(239, 68, 68, 0.12)"
                    : Number(temperatura) >= 50
                    ? "rgba(234, 179, 8, 0.12)"
                    : "rgba(34, 197, 94, 0.12)",
                border:
                  Number(temperatura) >= 70
                    ? "1px solid #ef4444"
                    : Number(temperatura) >= 50
                    ? "1px solid #eab308"
                    : "1px solid #22c55e",
                color:
                  Number(temperatura) >= 70
                    ? "#f87171"
                    : Number(temperatura) >= 50
                    ? "#facc15"
                    : "#4ade80",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {Number(temperatura) >= 70
                ? "🔴 Status automático: FALHA"
                : Number(temperatura) >= 50
                ? "🟡 Status automático: ALERTA"
                : "🟢 Status automático: ONLINE"}
            </div>
          )}
        </div>
      </div>

      {/* ============================
          EXPLICAÇÃO DOS LIMITES
      ============================ */}

      <div
        style={{
          background: "#1f2937",
          borderRadius: "8px",
          padding: "12px",
          marginTop: "20px",
          fontSize: "12px",
          color: "#d1d5db",
        }}
      >
        <strong style={{ color: "white" }}>
          🌡️ Limites de temperatura
        </strong>

        <div style={{ marginTop: "6px" }}>
          🟢 Abaixo de 50°C — Online
        </div>

        <div style={{ marginTop: "4px" }}>
          🟡 De 50°C até 69°C — Alerta
        </div>

        <div style={{ marginTop: "4px" }}>
          🔴 70°C ou mais — Falha
        </div>
      </div>

      {/* ============================
          BOTÃO
      ============================ */}

      <button
        onClick={salvar}
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "14px",
          border: "none",
          borderRadius: "8px",
          background: "#2563eb",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        💾 Salvar Equipamento
      </button>
    </div>
  );
}