"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarManutencao = criarManutencao;
exports.listarManutencoes = listarManutencoes;
exports.atualizarManutencao = atualizarManutencao;
exports.excluirManutencao = excluirManutencao;
exports.listarTodasManutencoes = listarTodasManutencoes;
const prisma_1 = require("../lib/prisma");
// ==========================================
// REGISTRAR MANUTENÇÃO
// ==========================================
async function criarManutencao(req, res) {
    try {
        const equipamentoId = Number(req.params.id);
        const { tipo, responsavel, descricao, status, } = req.body;
        if (!equipamentoId) {
            return res.status(400).json({
                message: "ID do equipamento inválido.",
            });
        }
        if (!tipo || !responsavel || !descricao) {
            return res.status(400).json({
                message: "Tipo, responsável e descrição são obrigatórios.",
            });
        }
        const equipamento = await prisma_1.prisma.equipamento.findUnique({
            where: {
                id: equipamentoId,
            },
        });
        if (!equipamento) {
            return res.status(404).json({
                message: "Equipamento não encontrado.",
            });
        }
        const manutencao = await prisma_1.prisma.manutencao.create({
            data: {
                tipo,
                responsavel,
                descricao,
                status: status || "concluida",
                equipamentoId,
            },
        });
        return res.status(201).json(manutencao);
    }
    catch (error) {
        console.error("Erro ao registrar manutenção:", error);
        return res.status(500).json({
            message: "Erro ao registrar manutenção.",
        });
    }
}
// ==========================================
// LISTAR HISTÓRICO DE MANUTENÇÕES
// ==========================================
async function listarManutencoes(req, res) {
    try {
        const equipamentoId = Number(req.params.id);
        if (!equipamentoId) {
            return res.status(400).json({
                message: "ID do equipamento inválido.",
            });
        }
        const manutencoes = await prisma_1.prisma.manutencao.findMany({
            where: {
                equipamentoId,
            },
            orderBy: {
                data: "desc",
            },
        });
        return res.json(manutencoes);
    }
    catch (error) {
        console.error("Erro ao buscar histórico:", error);
        return res.status(500).json({
            message: "Erro ao buscar histórico de manutenção.",
        });
    }
}
// ==========================================
// EDITAR MANUTENÇÃO
// ==========================================
async function atualizarManutencao(req, res) {
    try {
        const id = Number(req.params.manutencaoId);
        const { tipo, responsavel, descricao, status, } = req.body;
        const manutencao = await prisma_1.prisma.manutencao.update({
            where: {
                id,
            },
            data: {
                tipo,
                responsavel,
                descricao,
                status,
            },
        });
        return res.json(manutencao);
    }
    catch (error) {
        console.error("Erro ao atualizar manutenção:", error);
        return res.status(500).json({
            message: "Erro ao atualizar manutenção.",
        });
    }
}
// ==========================================
// EXCLUIR MANUTENÇÃO
// ==========================================
async function excluirManutencao(req, res) {
    try {
        const id = Number(req.params.manutencaoId);
        await prisma_1.prisma.manutencao.delete({
            where: {
                id,
            },
        });
        return res.json({
            message: "Manutenção excluída com sucesso.",
        });
    }
    catch (error) {
        console.error("Erro ao excluir manutenção:", error);
        return res.status(500).json({
            message: "Erro ao excluir manutenção.",
        });
    }
}
// ==========================================
// LISTAR TODAS AS MANUTENÇÕES
// ==========================================
async function listarTodasManutencoes(req, res) {
    try {
        const manutencoes = await prisma_1.prisma.manutencao.findMany({
            orderBy: {
                data: "desc",
            },
            include: {
                equipamento: true,
            },
        });
        return res.json(manutencoes);
    }
    catch (error) {
        console.error("Erro ao buscar todas as manutenções:", error);
        return res.status(500).json({
            message: "Erro ao buscar todas as manutenções.",
        });
    }
}
