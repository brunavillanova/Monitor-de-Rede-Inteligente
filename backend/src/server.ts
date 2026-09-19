import express from "express";
import cors from "cors";

import equipamentoRoutes from "./routes/equipamentoRoutes";
import { prisma } from "./lib/prisma";



const app = express();

app.use(cors());
app.use(express.json());

app.use("/equipamentos", equipamentoRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Smart Grid API funcionando 🚀",
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});