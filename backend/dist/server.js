"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const equipamentoRoutes_1 = __importDefault(require("./routes/equipamentoRoutes"));
const manutencaoRoutes_1 = __importDefault(require("./routes/manutencaoRoutes"));
const manutencaoGeralRoutes_1 = __importDefault(require("./routes/manutencaoGeralRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Equipamentos
app.use("/equipamentos", equipamentoRoutes_1.default);
// Manutenções de um equipamento
app.use("/equipamentos/:id/manutencoes", manutencaoRoutes_1.default);
// Todas as manutenções
app.use("/manutencoes", manutencaoGeralRoutes_1.default);
app.get("/", (req, res) => {
    res.json({
        message: "Smart Grid API funcionando 🚀",
    });
});
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
