import { Router } from "express";

import {
  criarManutencao,
  listarManutencoes,
  atualizarManutencao,
  excluirManutencao,
} from "../controllers/manutencaoController";

const router = Router({ mergeParams: true });

// Registrar manutenção
router.post("/", criarManutencao);

// Listar histórico
router.get("/", listarManutencoes);

// Editar manutenção
router.put(
  "/:manutencaoId",
  atualizarManutencao
);

// Excluir manutenção
router.delete(
  "/:manutencaoId",
  excluirManutencao
);

export default router;