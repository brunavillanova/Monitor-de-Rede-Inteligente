"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const manutencaoController_1 = require("../controllers/manutencaoController");
const router = (0, express_1.Router)();
router.get("/", manutencaoController_1.listarTodasManutencoes);
exports.default = router;
