import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function listarEquipamentos(
  req: Request,
  res: Response
) {
  const equipamentos = await prisma.equipamento.findMany();

  res.json(equipamentos);
}

export async function criarEquipamento(
  req: Request,
  res: Response
) {
  const {
    nome,
    latitude,
    longitude,
    status,
    tensao,
    corrente,
    temperatura,
  } = req.body;

  const equipamento = await prisma.equipamento.create({
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

export async function registrarManutencao(
  req: Request,
  res: Response
) {
  const id = Number(req.params.id);

  const equipamento = await prisma.equipamento.update({
    where: { id },
    data: {
      status: "online",
      temperatura: 42,
      corrente: 240,
    },
  });

  res.json(equipamento);
}

export async function atualizarEquipamento(
  req: Request,
  res: Response
) {
  const id = Number(req.params.id);

  const {
    nome,
    latitude,
    longitude,
    status,
    tensao,
    corrente,
    temperatura,
  } = req.body;

  const equipamento = await prisma.equipamento.update({
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

export async function excluirEquipamento(
  req: Request,
  res: Response
) {
  const id = Number(req.params.id);

  await prisma.equipamento.delete({
    where: { id },
  });

  res.json({
    message: "Equipamento excluído com sucesso",
  });
}