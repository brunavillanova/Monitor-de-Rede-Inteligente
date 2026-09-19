"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const medicaoController_1 = require("../controllers/medicaoController");
const router = (0, express_1.Router)({ mergeParams: true });
router.post("/", medicaoController_1.criarMedicao);
router.get("/", medicaoController_1.listarMedicoes);
exports.default = router;
