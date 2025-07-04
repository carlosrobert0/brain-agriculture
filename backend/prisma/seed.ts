import { PrismaClient, DocumentType } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...")

  // Limpar dados existentes (opcional)
  await prisma.crop.deleteMany()
  await prisma.harvest.deleteMany()
  await prisma.farm.deleteMany()
  await prisma.producer.deleteMany()

  console.log("🗑️ Dados anteriores removidos")

  // Criar produtores
  const producers = await Promise.all([
    prisma.producer.create({
      data: {
        name: "João Silva Santos",
        document: "12345678901", // CPF válido para teste
        documentType: DocumentType.CPF,
      },
    }),
    prisma.producer.create({
      data: {
        name: "Maria Oliveira Costa",
        document: "98765432100", // CPF válido para teste
        documentType: DocumentType.CPF,
      },
    }),
    prisma.producer.create({
      data: {
        name: "Agropecuária Três Irmãos Ltda",
        document: "12345678000195", // CNPJ válido para teste
        documentType: DocumentType.CNPJ,
      },
    }),
    prisma.producer.create({
      data: {
        name: "Fazendas Reunidas do Cerrado S.A.",
        document: "98765432000176", // CNPJ válido para teste
        documentType: DocumentType.CNPJ,
      },
    }),
    prisma.producer.create({
      data: {
        name: "Carlos Eduardo Ferreira",
        document: "11122233344", // CPF válido para teste
        documentType: DocumentType.CPF,
      },
    }),
  ])

  console.log("✅ Produtores criados:", producers.length)

  // Criar fazendas
  const farms = await Promise.all([
    // Fazendas do João Silva
    prisma.farm.create({
      data: {
        name: "Fazenda São João",
        city: "Ribeirão Preto",
        state: "SP",
        totalArea: 150.0,
        arableArea: 120.0,
        vegetationArea: 30.0,
        producerId: producers[0].id,
      },
    }),
    prisma.farm.create({
      data: {
        name: "Sítio Boa Vista",
        city: "Franca",
        state: "SP",
        totalArea: 80.0,
        arableArea: 60.0,
        vegetationArea: 20.0,
        producerId: producers[0].id,
      },
    }),

    // Fazendas da Maria Oliveira
    prisma.farm.create({
      data: {
        name: "Fazenda Santa Maria",
        city: "Uberlândia",
        state: "MG",
        totalArea: 200.0,
        arableArea: 160.0,
        vegetationArea: 40.0,
        producerId: producers[1].id,
      },
    }),

    // Fazendas da Agropecuária Três Irmãos
    prisma.farm.create({
      data: {
        name: "Fazenda Três Irmãos",
        city: "Sorriso",
        state: "MT",
        totalArea: 1000.0,
        arableArea: 800.0,
        vegetationArea: 200.0,
        producerId: producers[2].id,
      },
    }),
    prisma.farm.create({
      data: {
        name: "Fazenda Nova Esperança",
        city: "Lucas do Rio Verde",
        state: "MT",
        totalArea: 750.0,
        arableArea: 600.0,
        vegetationArea: 150.0,
        producerId: producers[2].id,
      },
    }),

    // Fazendas Reunidas do Cerrado
    prisma.farm.create({
      data: {
        name: "Fazenda Cerrado Grande",
        city: "Luís Eduardo Magalhães",
        state: "BA",
        totalArea: 2000.0,
        arableArea: 1600.0,
        vegetationArea: 400.0,
        producerId: producers[3].id,
      },
    }),
    prisma.farm.create({
      data: {
        name: "Fazenda Planalto",
        city: "Barreiras",
        state: "BA",
        totalArea: 1500.0,
        arableArea: 1200.0,
        vegetationArea: 300.0,
        producerId: producers[3].id,
      },
    }),

    // Fazenda do Carlos Eduardo
    prisma.farm.create({
      data: {
        name: "Fazenda Bela Vista",
        city: "Rio Verde",
        state: "GO",
        totalArea: 300.0,
        arableArea: 240.0,
        vegetationArea: 60.0,
        producerId: producers[4].id,
      },
    }),
  ])

  console.log("✅ Fazendas criadas:", farms.length)

  // Criar safras
  const harvests = await Promise.all([
    // Safras 2023
    prisma.harvest.create({
      data: {
        year: 2023,
        season: "Safra",
        farmId: farms[0].id, // Fazenda São João
      },
    }),
    prisma.harvest.create({
      data: {
        year: 2023,
        season: "Safrinha",
        farmId: farms[0].id, // Fazenda São João
      },
    }),
    prisma.harvest.create({
      data: {
        year: 2023,
        season: "Safra",
        farmId: farms[1].id, // Sítio Boa Vista
      },
    }),
    prisma.harvest.create({
      data: {
        year: 2023,
        season: "Safra",
        farmId: farms[2].id, // Fazenda Santa Maria
      },
    }),
    prisma.harvest.create({
      data: {
        year: 2023,
        season: "Safra",
        farmId: farms[3].id, // Fazenda Três Irmãos
      },
    }),
    prisma.harvest.create({
      data: {
        year: 2023,
        season: "Safrinha",
        farmId: farms[3].id, // Fazenda Três Irmãos
      },
    }),

    // Safras 2024
    prisma.harvest.create({
      data: {
        year: 2024,
        season: "Safra",
        farmId: farms[4].id, // Fazenda Nova Esperança
      },
    }),
    prisma.harvest.create({
      data: {
        year: 2024,
        season: "Safra",
        farmId: farms[5].id, // Fazenda Cerrado Grande
      },
    }),
    prisma.harvest.create({
      data: {
        year: 2024,
        season: "Safrinha",
        farmId: farms[5].id, // Fazenda Cerrado Grande
      },
    }),
    prisma.harvest.create({
      data: {
        year: 2024,
        season: "Safra",
        farmId: farms[6].id, // Fazenda Planalto
      },
    }),
    prisma.harvest.create({
      data: {
        year: 2024,
        season: "Safra",
        farmId: farms[7].id, // Fazenda Bela Vista
      },
    }),
  ])

  console.log("✅ Safras criadas:", harvests.length)

  // Criar culturas
  const crops = await prisma.crop.createMany({
    data: [
      // Safra 2023 - Fazenda São João
      { name: "Soja", area: 80.0, harvestId: harvests[0].id },
      { name: "Milho", area: 40.0, harvestId: harvests[0].id },
      { name: "Milho", area: 60.0, harvestId: harvests[1].id }, // Safrinha
      { name: "Feijão", area: 20.0, harvestId: harvests[1].id }, // Safrinha

      // Safra 2023 - Sítio Boa Vista
      { name: "Café", area: 35.0, harvestId: harvests[2].id },
      { name: "Cana-de-açúcar", area: 25.0, harvestId: harvests[2].id },

      // Safra 2023 - Fazenda Santa Maria
      { name: "Soja", area: 100.0, harvestId: harvests[3].id },
      { name: "Milho", area: 60.0, harvestId: harvests[3].id },

      // Safra 2023 - Fazenda Três Irmãos
      { name: "Soja", area: 400.0, harvestId: harvests[4].id },
      { name: "Algodão", area: 200.0, harvestId: harvests[4].id },
      { name: "Milho", area: 200.0, harvestId: harvests[4].id },
      { name: "Milho", area: 300.0, harvestId: harvests[5].id }, // Safrinha
      { name: "Feijão", area: 100.0, harvestId: harvests[5].id }, // Safrinha

      // Safra 2024 - Fazenda Nova Esperança
      { name: "Soja", area: 350.0, harvestId: harvests[6].id },
      { name: "Algodão", area: 250.0, harvestId: harvests[6].id },

      // Safra 2024 - Fazenda Cerrado Grande
      { name: "Soja", area: 800.0, harvestId: harvests[7].id },
      { name: "Algodão", area: 400.0, harvestId: harvests[7].id },
      { name: "Milho", area: 400.0, harvestId: harvests[7].id },
      { name: "Milho", area: 600.0, harvestId: harvests[8].id }, // Safrinha
      { name: "Feijão", area: 200.0, harvestId: harvests[8].id }, // Safrinha

      // Safra 2024 - Fazenda Planalto
      { name: "Soja", area: 600.0, harvestId: harvests[9].id },
      { name: "Milho", area: 400.0, harvestId: harvests[9].id },
      { name: "Algodão", area: 200.0, harvestId: harvests[9].id },

      // Safra 2024 - Fazenda Bela Vista
      { name: "Soja", area: 150.0, harvestId: harvests[10].id },
      { name: "Milho", area: 90.0, harvestId: harvests[10].id },
    ],
  })

  console.log("✅ Culturas criadas:", crops.count)

  // Estatísticas finais
  const stats = await Promise.all([
    prisma.producer.count(),
    prisma.farm.count(),
    prisma.harvest.count(),
    prisma.crop.count(),
    prisma.farm.aggregate({ _sum: { totalArea: true } }),
  ])

  console.log("\n📊 Estatísticas do seed:")
  console.log(`👨‍🌾 Produtores: ${stats[0]}`)
  console.log(`🏡 Fazendas: ${stats[1]}`)
  console.log(`🌾 Safras: ${stats[2]}`)
  console.log(`🌱 Culturas: ${stats[3]}`)
  console.log(`📏 Área total: ${stats[4]._sum.totalArea?.toLocaleString("pt-BR")} hectares`)

  console.log("\n🎉 Seed concluído com sucesso!")
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
