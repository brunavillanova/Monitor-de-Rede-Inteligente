import { useState } from "react";

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

interface Props {
  equipamento: Equipamento;
  onClose: () => void;
  onAtualizado: () => void;
}

export function EditarEquipamento({
  equipamento,
  onClose,
  onAtualizado,
}: Props) {
  // ============================
  // States dos campos
  // ============================

  const [nome, setNome] = useState(equipamento.nome);

  const [latitude, setLatitude] = useState(
    equipamento.latitude.toString()
  );

  const [longitude, setLongitude] = useState(
    equipamento.longitude.toString()
  );

  const [tensao, setTensao] = useState(
    equipamento.tensao?.toString() || ""
  );

  const [corrente, setCorrente] = useState(
    equipamento.corrente?.toString() || ""
  );

  const [temperatura, setTemperatura] = useState(
    equipamento.temperatura?.toString() || ""
  );

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
  // Salvar alterações
  // ============================

  async function salvar() {
    try {
      let status = "online";

      const temperaturaNum = Number(temperatura);

      if (temperaturaNum >= 70) {
        status = "falha";
      } else if (temperaturaNum >= 50) {
        status = "alerta";
      }

      await api.put(
        `/equipamentos/${equipamento.id}`,
        {
          nome,
          latitude: Number(latitude),
          longitude: Number(longitude),
          status,
          tensao: tensao
            ? Number(tensao)
            : null,
          corrente: corrente
            ? Number(corrente)
            : null,
          temperatura: temperatura
            ? Number(temperatura)
            : null,
        }
      );

      alert("✅ Equipamento atualizado!");

      onAtualizado();

      onClose();
    } catch (error) {
      console.error(error);

      alert("❌ Erro ao atualizar equipamento");
    }
  }

  // ============================
  // Modal de edição
  // ============================

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* ============================
          CARD DO MODAL
      ============================ */}

      <div
        style={{
          background: "#111827",
          padding: "30px",
          borderRadius: "12px",
          width: "500px",
          maxWidth: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          border: "1px solid #374151",
          boxSizing: "border-box",
        }}
      >
        {/* ============================
            TÍTULO
        ============================ */}

        <h2
          style={{
            marginBottom: "10px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          ✏️ Editar Equipamento
        </h2>

        {/* ============================
            NOME
        ============================ */}

        <label
          style={{
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

        {/* ============================
            LATITUDE
        ============================ */}

        <label
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: "14px",
            marginTop: "5px",
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

        {/* ============================
            LONGITUDE
        ============================ */}

        <label
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: "14px",
            marginTop: "5px",
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

        {/* ============================
            TENSÃO
        ============================ */}

        <label
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: "14px",
            marginTop: "5px",
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

        {/* ============================
            CORRENTE
        ============================ */}

        <label
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: "14px",
            marginTop: "5px",
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

        {/* ============================
            TEMPERATURA
        ============================ */}

        <label
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: "14px",
            marginTop: "5px",
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
              Number(temperatura) >= 70
                ? "1px solid #ef4444"
                : Number(temperatura) >= 50
                ? "1px solid #eab308"
                : "1px solid #374151",
          }}
        />

        {/* ============================
            INDICADOR DA TEMPERATURA
        ============================ */}

        {temperatura !== "" && (
          <div
            style={{
              padding: "10px",
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
              fontSize: "13px",
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

        {/* ============================
            EXPLICAÇÃO DOS LIMITES
        ============================ */}

        <div
          style={{
            background: "#1f2937",
            borderRadius: "8px",
            padding: "12px",
            marginTop: "4px",
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
            BOTÕES
        ============================ */}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "15px",
          }}
        >
          <button
            onClick={salvar}
            style={{
              padding: "10px 16px",
              border: "none",
              borderRadius: "8px",
              background: "#2563eb",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            💾 Salvar Alterações
          </button>

          <button
            onClick={onClose}
            style={{
              padding: "10px 16px",
              border: "none",
              borderRadius: "8px",
              background: "#dc2626",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ❌ Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}