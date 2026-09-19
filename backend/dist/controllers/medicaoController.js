"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarMedicao = criarMedicao;
exports.listarMedicoes = listarMedicoes;
const prisma_1 = require("../lib/prisma");
// Criar uma nova medição
async function criarMedicao(req, res) {
    try {
        const equipamentoId = Number(req.params.id);
        const { temperatura, tensao, corrente, } = req.body;
        const equipamento = await prisma_1.prisma.equipamento.findUnique({
            where: {
                id: equipamentoId,
            },
        });
        if (!equipamento) {
            return res.status(404).json({
                erro: "Equipamento não encontrado",
            });
        }
        const medicao = await prisma_1.prisma.medicao.create({
            data: {
                equipamentoId,
                temperatura: temperatura !== undefined
                    ? Number(temperatura)
                    : null,
                tensao: tensao !== undefined
                    ? Number(tensao)
                    : null,
                corrente: corrente !== undefined
                    ? Number(corrente)
                    : null,
            },
        });
        return res.status(201).json(medicao);
    }
    catch (erro) {
        console.error("Erro ao criar medição:", erro);
        return res.status(500).json({
            erro: "Erro ao criar medição",
        });
    }
}
// Listar histórico de medições
async function listarMedicoes(req, res) {
    try {
        const equipamentoId = Number(req.params.id);
        const equipamento = await prisma_1.prisma.equipamento.findUnique({
            where: {
                id: equipamentoId,
            },
        });
        if (!equipamento) {
            return res.status(404).json({
                erro: "Equipamento não encontrado",
            });
        }
        const medicoes = await prisma_1.prisma.medicao.findMany({
            where: {
                equipamentoId,
            },
            orderBy: {
                data: "asc",
            },
        });
        return res.json(medicoes);
    }
    catch (erro) {
        console.error("Erro ao listar medições:", erro);
        return res.status(500).json({
            erro: "Erro ao listar medições",
        });
    }
}
