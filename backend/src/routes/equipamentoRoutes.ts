import { Router } from "express";

import {
  listarEquipamentos,
  criarEquipamento,
  registrarManutencao,
  atualizarEquipamento,
  excluirEquipamento,
} from "../controllers/equipamentoController";

const router = Router();

router.get("/", listarEquipamentos);

router.post("/", criarEquipamento);

router.put("/:id", atualizarEquipamento);

router.delete("/:id", excluirEquipamento);

router.put("/:id/manutencao", registrarManutencao);



export default router;