import { Router } from "express";

import {
  listarTodasManutencoes,
} from "../controllers/manutencaoController";

const router = Router();

router.get("/", listarTodasManutencoes);

export default router;