const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

// Instancia o driver adapter para o SQLite conforme exigido pelo Prisma 7
const adapter = new PrismaBetterSqlite3({
  url: "file:./prisma/dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Iniciando semeadura do banco de dados...");

  // Limpa o banco de dados antes de popular
  await prisma.aulaConcluida.deleteMany({});
  await prisma.inscricao.deleteMany({});
  await prisma.aula.deleteMany({});
  await prisma.curso.deleteMany({});
  await prisma.usuario.deleteMany({});

  console.log("Banco de dados limpo com sucesso.");

  // 1. Criar Cursos com suas Aulas
  const curso1 = await prisma.curso.create({
    data: {
      id: "c1",
      categoria: "Formalização",
      titulo: "Descomplicando o MEI da Empresa",
      descricao: "Passo a passo completo para abertura, emissão de notas e obrigações legais sem burocracia.",
      icone: "📋",
      aulas: {
        create: [
          { id: "a1-1", titulo: "Introdução ao MEI e Regras Gerais", duracao: "15 min" },
          { id: "a1-2", titulo: "Documentação Necessária para Abertura", duracao: "22 min" },
          { id: "a1-3", titulo: "Emitindo sua Primeira Nota Fiscal Eletrônica", duracao: "30 min" },
        ],
      },
    },
  });

  const curso2 = await prisma.curso.create({
    data: {
      id: "c2",
      categoria: "Marketing",
      titulo: "Marketing Digital de Atração",
      descricao: "Como estruturar o posicionamento digital da sua marca para atrair clientes organicamente.",
      icone: "📣",
      aulas: {
        create: [
          { id: "a2-1", titulo: "Definição de Público-Alvo e Persona", duracao: "18 min" },
          { id: "a2-2", titulo: "Configurando Redes Sociais Profissionais", duracao: "25 min" },
          { id: "a2-3", titulo: "Estratégias Básicas de Tráfego Orgânico", duracao: "20 min" },
        ],
      },
    },
  });

  const curso3 = await prisma.curso.create({
    data: {
      id: "c3",
      categoria: "Segurança",
      titulo: "Segurança Digital Corporativa",
      descricao: "Proteção de dados críticos, engenharia social e conformidade essencial para microempresas.",
      icone: "🛡️",
      aulas: {
        create: [
          { id: "a3-1", titulo: "Princípios da Segurança da Informação", duracao: "12 min" },
          { id: "a3-2", titulo: "Gerenciamento Seguro de Senhas e Acessos", duracao: "19 min" },
          { id: "a3-3", titulo: "Evitando Golpes Comuns no Meio Digital", duracao: "28 min" },
        ],
      },
    },
  });

  console.log("Cursos e aulas semeados com sucesso:");
  console.log(`- ${curso1.titulo}`);
  console.log(`- ${curso2.titulo}`);
  console.log(`- ${curso3.titulo}`);
}

main()
  .catch((e) => {
    console.error("Erro ao semear o banco de dados:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
