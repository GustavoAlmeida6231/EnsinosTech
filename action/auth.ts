"use server";

export async function criarConta(formData: FormData) {
  const nome = formData.get("nome");
  const email = formData.get("email");
  const senha = formData.get("senha");
  const confirmarSenha = formData.get("confirmarSenha");
  if (!nome || !email || !senha) {
    return { erro: "Todos os campos obrigatórios devem ser preenchidos." };
  }

  if (senha !== confirmarSenha) {
    return { erro: "As senhas não coincidem." };
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log(`Novo usuário pronto para o banco: ${nome} - ${email}`);

  return { sucesso: true, mensagem: "Conta criada com sucesso!" };
}