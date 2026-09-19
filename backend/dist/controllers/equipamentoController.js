"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarEquipamentos = listarEquipamentos;
exports.criarEquipamento = criarEquipamento;
exports.registrarManutencao = registrarManutencao;
exports.atualizarEquipamento = atualizarEquipamento;
exports.excluirEquipamento = excluirEquipamento;
const prisma_1 = require("../lib/prisma");
async function listarEquipamentos(req, res) {
    const equipamentos = await prisma_1.prisma.equipamento.findMany();
    res.json(equipamentos);
}
async function criarEquipamento(req, res) {
    const { nome, latitude, longitude, status, tensao, corrente, temperatura, } = req.body;
    const equipamento = await prisma_1.prisma.equipamento.create({
        data: {
            nome,
            latitude,
            longitude,
            status,
            tensao,
            corrente,
            temperatura,
        },
    });
    res.status(201).json(equipamento);
}
async function registrarManutencao(req, res) {
    const id = Number(req.params.id);
    const equipamento = await prisma_1.prisma.equipamento.update({
        where: { id },
        data: {
            status: "online",
            temperatura: 42,
            corrente: 240,
        },
    });
    res.json(equipamento);
}
async function atualizarEquipamento(req, res) {
    const id = Number(req.params.id);
    const { nome, latitude, longitude, status, tensao, corrente, temperatura, } = req.body;
    const equipamento = await prisma_1.prisma.equipamento.update({
        where: { id },
        data: {
            nome,
            latitude,
            longitude,
            status,
            tensao,
            corrente,
            temperatura,
        },
    });
    res.json(equipamento);
}
async function excluirEquipamento(req, res) {
    const id = Number(req.params.id);
    await prisma_1.prisma.equipamento.delete({
        where: { id },
    });
    res.json({
        message: "Equipamento excluído com sucesso",
    });
}
