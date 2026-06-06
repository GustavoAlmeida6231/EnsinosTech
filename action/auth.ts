"use server";

import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Auxiliar para obter a sessão/userId do cookie
export async function obterUserIdDaSessao() {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId");
  return userIdCookie?.value || null;
}

// 1. Criar Conta (Cadastro)
export async function criarConta(formData: FormData) {
  const nome = formData.get("nome")?.toString();
  const email = formData.get("email")?.toString();
  const senha = formData.get("senha")?.toString();
  const confirmarSenha = formData.get("confirmarSenha")?.toString();

  if (!nome || !email || !senha) {
    return { erro: "Todos os campos obrigatórios devem ser preenchidos." };
  }

  if (senha !== confirmarSenha) {
    return { erro: "As senhas não coincidem." };
  }

  try {
    // Verifica se o usuário já existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      return { erro: "Este e-mail já está sendo utilizado." };
    }

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    // Cria o usuário
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaCriptografada,
      },
    });

    // Inscreve automaticamente o usuário no primeiro curso ("c1" - MEI) como cortesia inicial
    try {
      await prisma.inscricao.create({
        data: {
          usuarioId: novoUsuario.id,
          cursoId: "c1",
        },
      });
    } catch (e) {
      console.error("Erro ao auto-inscrever usuário:", e);
    }

    return { sucesso: true, mensagem: "Conta criada com sucesso!" };
  } catch (error: any) {
    console.error("Erro no cadastro:", error);
    return { erro: "Erro interno no servidor ao criar a conta." };
  }
}

// 2. Login
export async function login(formData: FormData) {
  const email = formData.get("email")?.toString();
  const senha = formData.get("senha")?.toString();

  if (!email || !senha) {
    return { erro: "Preencha todos os campos." };
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return { erro: "E-mail ou senha incorretos." };
    }

    // Compara senha criptografada
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return { erro: "E-mail ou senha incorretos." };
    }

    // Salva a sessão no cookie HTTP-only
    const cookieStore = await cookies();
    cookieStore.set("userId", usuario.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
    });

    return { sucesso: true, mensagem: "Login realizado com sucesso!" };
  } catch (error: any) {
    console.error("Erro no login:", error);
    return { erro: "Erro interno no servidor ao realizar o login." };
  }
}

// 3. Logout (Sair da Plataforma)
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  redirect("/");
}

// 4. Obter Perfil do Usuário Logado
export async function obterUsuarioLogado() {
  try {
    const userId = await obterUserIdDaSessao();
    if (!userId) return null;

    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        empresa: true,
        papel: true,
      },
    });

    return usuario;
  } catch (error) {
    console.error("Erro ao carregar usuário logado:", error);
    return null;
  }
}

// 5. Atualizar Perfil
export async function atualizarPerfil(formData: FormData) {
  try {
    const userId = await obterUserIdDaSessao();
    if (!userId) {
      return { erro: "Usuário não autenticado." };
    }

    const nome = formData.get("nome")?.toString();
    const email = formData.get("email")?.toString();
    const empresa = formData.get("empresa")?.toString();

    if (!nome || !email) {
      return { erro: "Nome e e-mail são obrigatórios." };
    }

    // Verifica se e-mail já pertence a outro usuário
    const emailOcupado = await prisma.usuario.findFirst({
      where: {
        email,
        NOT: { id: userId },
      },
    });

    if (emailOcupado) {
      return { erro: "Este e-mail já está em uso por outro usuário." };
    }

    await prisma.usuario.update({
      where: { id: userId },
      data: {
        nome,
        email,
        empresa: empresa || null,
      },
    });

    return { sucesso: true, mensagem: "Perfil atualizado com sucesso!" };
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return { erro: "Erro interno no servidor ao atualizar o perfil." };
  }
}