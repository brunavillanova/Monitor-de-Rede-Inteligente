import express from "express";
import cors from "cors";

import equipamentoRoutes from "./routes/equipamentoRoutes";
import manutencaoRoutes from "./routes/manutencaoRoutes";
import manutencaoGeralRoutes from "./routes/manutencaoGeralRoutes";
import medicaoRoutes from "./routes/medicaoRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// Equipamentos
app.use("/equipamentos", equipamentoRoutes);

// Manutenções de um equipamento
app.use(
  "/equipamentos/:id/manutencoes",
  manutencaoRoutes
);

// Todas as manutenções
app.use(
  "/manutencoes",
  manutencaoGeralRoutes
);

app.get("/", (req, res) => {
  res.json({
    message: "Smart Grid API funcionando 🚀",
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});