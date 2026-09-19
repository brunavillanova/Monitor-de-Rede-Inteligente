import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// Criar uma nova medição
export async function criarMedicao(
  req: Request,
  res: Response
) {
  try {
    const equipamentoId = Number(req.params.id);

    const {
      temperatura,
      tensao,
      corrente,
    } = req.body;

    const equipamento = await prisma.equipamento.findUnique({
      where: {
        id: equipamentoId,
      },
    });

    if (!equipamento) {
      return res.status(404).json({
        erro: "Equipamento não encontrado",
      });
    }

    const medicao = await prisma.medicao.create({
      data: {
        equipamentoId,
        temperatura:
          temperatura !== undefined
            ? Number(temperatura)
            : null,
        tensao:
          tensao !== undefined
            ? Number(tensao)
            : null,
        corrente:
          corrente !== undefined
            ? Number(corrente)
            : null,
      },
    });

    return res.status(201).json(medicao);

  } catch (erro) {
    console.error("Erro ao criar medição:", erro);

    return res.status(500).json({
      erro: "Erro ao criar medição",
    });
  }
}

// Listar histórico de medições
export async function listarMedicoes(
  req: Request,
  res: Response
) {
  try {
    const equipamentoId = Number(req.params.id);

    const equipamento = await prisma.equipamento.findUnique({
      where: {
        id: equipamentoId,
      },
    });

    if (!equipamento) {
      return res.status(404).json({
        erro: "Equipamento não encontrado",
      });
    }

    const medicoes = await prisma.medicao.findMany({
      where: {
        equipamentoId,
      },
      orderBy: {
        data: "asc",
      },
    });

    return res.json(medicoes);

  } catch (erro) {
    console.error("Erro ao listar medições:", erro);

    return res.status(500).json({
      erro: "Erro ao listar medições",
    });
  }
}