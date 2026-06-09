"use server";

import { prisma } from "../lib/prisma";
import { obterUserIdDaSessao } from "./auth";
import { revalidatePath } from "next/cache";

// 1. Listar todos os Cursos e suas Aulas
export async function listarCursos() {
  try {
    const cursos = await prisma.curso.findMany({
      include: {
        aulas: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return cursos;
  } catch (error) {
    console.error("Erro ao listar cursos:", error);
    return [];
  }
}

// 2. Obter o Progresso do Usuário Logado
// Retorna a lista de IDs dos cursos inscritos e lista de IDs das aulas concluídas
export async function obterProgressoUsuario() {
  try {
    const userId = await obterUserIdDaSessao();
    if (!userId) {
      return { cursosInscritos: [], aulasConcluidas: [] };
    }

    // Busca inscrições
    const inscricoes = await prisma.inscricao.findMany({
      where: { usuarioId: userId },
      select: { cursoId: true },
    });

    // Busca aulas concluídas
    const concluidas = await prisma.aulaConcluida.findMany({
      where: { usuarioId: userId },
      select: { aulaId: true },
    });

    return {
      // Substitua 'Inscricao' pelo nome da sua interface/tipo, se houver
      cursosInscritos: inscricoes.map((i: any) => i.cursoId), 
      aulasConcluidas: concluidas.map((c: any) => c.aulaId),
    };
  } catch (error) {
    console.error("Erro ao obter progresso:", error);
    return { cursosInscritos: [], aulasConcluidas: [] };
  }
}

// 3. Inscrever ou Cancelar Inscrição em um Curso
export async function alternarInscricao(cursoId: string) {
  try {
    const userId = await obterUserIdDaSessao();
    if (!userId) {
      return { erro: "Você precisa estar logado para se inscrever." };
    }

    // Verifica se já está inscrito
    const inscricaoExistente = await prisma.inscricao.findUnique({
      where: {
        usuarioId_cursoId: {
          usuarioId: userId,
          cursoId: cursoId,
        },
      },
    });

    if (inscricaoExistente) {
      // Cancela a inscrição
      await prisma.inscricao.delete({
        where: {
          usuarioId_cursoId: {
            usuarioId: userId,
            cursoId: cursoId,
          },
        },
      });

      // Opcional: Remove também a conclusão das aulas pertencentes a esse curso para resetar progresso
      const aulasDoCurso = await prisma.aula.findMany({
        where: { cursoId: cursoId },
        select: { id: true },
      });
      const aulaIds = aulasDoCurso.map((a) => a.id);

      await prisma.aulaConcluida.deleteMany({
        where: {
          usuarioId: userId,
          aulaId: { in: aulaIds },
        },
      });

      revalidatePath("/dashboard");
      return { sucesso: true, inscrito: false, mensagem: "Inscrição cancelada com sucesso." };
    } else {
      // Cria nova inscrição
      await prisma.inscricao.create({
        data: {
          usuarioId: userId,
          cursoId: cursoId,
        },
      });

      revalidatePath("/dashboard");
      return { sucesso: true, inscrito: true, mensagem: "Inscrição realizada com sucesso!" };
    }
  } catch (error) {
    console.error("Erro ao alternar inscrição:", error);
    return { erro: "Erro ao atualizar inscrição." };
  }
}

// 4. Marcar ou Desmarcar Aula Concluída
export async function alternarAulaConcluida(aulaId: string) {
  try {
    const userId = await obterUserIdDaSessao();
    if (!userId) {
      return { erro: "Usuário não autenticado." };
    }

    // Verifica se já está marcada como concluída
    const conclusaoExistente = await prisma.aulaConcluida.findUnique({
      where: {
        usuarioId_aulaId: {
          usuarioId: userId,
          aulaId: aulaId,
        },
      },
    });

    if (conclusaoExistente) {
      // Desmarca a conclusão
      await prisma.aulaConcluida.delete({
        where: {
          usuarioId_aulaId: {
            usuarioId: userId,
            aulaId: aulaId,
          },
        },
      });

      revalidatePath("/dashboard");
      return { sucesso: true, concluida: false, mensagem: "Aula marcada como pendente." };
    } else {
      // Marca como concluída
      await prisma.aulaConcluida.create({
        data: {
          usuarioId: userId,
          aulaId: aulaId,
        },
      });

      revalidatePath("/dashboard");
      return { sucesso: true, concluida: true, mensagem: "Aula concluída com sucesso!" };
    }
  } catch (error) {
    console.error("Erro ao alternar conclusão de aula:", error);
    return { erro: "Erro ao atualizar progresso da aula." };
  }
}
