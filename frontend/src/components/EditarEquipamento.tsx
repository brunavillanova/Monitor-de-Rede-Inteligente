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
  // Estilo padrão dos inputs
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

      await api.put(`/equipamentos/${equipamento.id}`, {
        nome,
        latitude: Number(latitude),
        longitude: Number(longitude),
        status,
        tensao: tensao ? Number(tensao) : null,
        corrente: corrente ? Number(corrente) : null,
        temperatura: temperatura
          ? Number(temperatura)
          : null,
      });

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
      }}
    >
      {/* Card do Modal */}
      <div
        style={{
          background: "#111827",
          padding: "30px",
          borderRadius: "12px",
          width: "500px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          border: "1px solid #374151",
        }}
      >
        {/* Título */}
        <h2
          style={{
            marginBottom: "10px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          ✏️ Editar Equipamento
        </h2>

        {/* Nome */}
        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={inputStyle}
        />

        {/* Latitude */}
        <input
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          style={inputStyle}
        />

        {/* Longitude */}
        <input
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          style={inputStyle}
        />

        {/* Tensão */}
        <input
          placeholder="Tensão (kV)"
          value={tensao}
          onChange={(e) => setTensao(e.target.value)}
          style={inputStyle}
        />

        {/* Corrente */}
        <input
          placeholder="Corrente (A)"
          value={corrente}
          onChange={(e) => setCorrente(e.target.value)}
          style={inputStyle}
        />

        {/* Temperatura */}
        <input
          placeholder="Temperatura (°C)"
          value={temperatura}
          onChange={(e) =>
            setTemperatura(e.target.value)
          }
          style={inputStyle}
        />

        {/* Botões */}
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
            }}
          >
            ❌ Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}