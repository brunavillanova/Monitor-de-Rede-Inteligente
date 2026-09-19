-- CreateTable
CREATE TABLE "Medicao" (
    "id" SERIAL NOT NULL,
    "temperatura" DOUBLE PRECISION,
    "tensao" DOUBLE PRECISION,
    "corrente" DOUBLE PRECISION,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipamentoId" INTEGER NOT NULL,

    CONSTRAINT "Medicao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Medicao" ADD CONSTRAINT "Medicao_equipamentoId_fkey" FOREIGN KEY ("equipamentoId") REFERENCES "Equipamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
