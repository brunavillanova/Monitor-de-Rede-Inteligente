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
  // Salvar equipamento
  // ============================

  async function salvar() {
    try {
      let status = "online";

      // Define status automático
      if (Number(temperatura) >= 70) {
        status = "falha";
      } else if (Number(temperatura) >= 50) {
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
        maxWidth: "700px", // Ajusta largura do formulário
        margin: "0 auto",
        background: "#111827",
        padding: "30px",
        borderRadius: "12px",
        border: "1px solid #374151",
      }}
    >
      {/* Título */}
      <h2
        style={{
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        ➕ Novo Equipamento
      </h2>

      {/* Grid dos campos */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr", // 2 colunas
          gap: "15px",
        }}
      >
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
          onChange={(e) => setTemperatura(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Botão Salvar */}
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