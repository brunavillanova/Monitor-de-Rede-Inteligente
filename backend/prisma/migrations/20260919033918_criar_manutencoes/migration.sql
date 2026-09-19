-- CreateTable
CREATE TABLE "Manutencao" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'concluida',
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipamentoId" INTEGER NOT NULL,

    CONSTRAINT "Manutencao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Manutencao" ADD CONSTRAINT "Manutencao_equipamentoId_fkey" FOREIGN KEY ("equipamentoId") REFERENCES "Equipamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
