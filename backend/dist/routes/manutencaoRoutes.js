"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const manutencaoController_1 = require("../controllers/manutencaoController");
const router = (0, express_1.Router)({ mergeParams: true });
// Registrar manutenção
router.post("/", manutencaoController_1.criarManutencao);
// Listar histórico
router.get("/", manutencaoController_1.listarManutencoes);
// Editar manutenção
router.put("/:manutencaoId", manutencaoController_1.atualizarManutencao);
// Excluir manutenção
router.delete("/:manutencaoId", manutencaoController_1.excluirManutencao);
exports.default = router;
