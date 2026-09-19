import { Router } from "express";

import {
  criarMedicao,
  listarMedicoes,
} from "../controllers/medicaoController";

const router = Router({ mergeParams: true });

router.post("/", criarMedicao);
router.get("/", listarMedicoes);

export default router;