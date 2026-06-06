"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoImage from "../../public/logo.png";
import bg2Image from "../../public/backg.png";
import { criarConta } from "../../action/auth";

export default function Cadastro() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErro(null);
    setSucesso(null);

    const formData = new FormData(event.currentTarget);
    const resultado = await criarConta(formData);

    setLoading(false);

    if (resultado?.erro) {
      setErro(resultado.erro);
    } else if (resultado?.sucesso) {
      setSucesso(resultado.mensagem || "Conta criada com sucesso!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  }

  return (
    <main className="min-h-screen relative flex flex-col justify-center items-center p-4">
      <div className="absolute inset-0 z-0">
        <Image
          src={bg2Image}
          alt="Background"
          fill
          className="object-cover blur-sm"
          priority
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="absolute top-8 left-8 z-50">
        <Link href="/" className="group flex items-center justify-center transition-transform hover:scale-105">
          <div className="w-12 h-12 bg-[#88D66C] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md transition hover:bg-green-700">
            ←
          </div>
        </Link>
      </div>

      <div className="relative z-10 bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-xl border border-gray-100 transition-all">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="relative w-14 h-14 mb-3">
            <Image src={logoImage} alt="Logo EnsinosTech" fill className="object-contain" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1b4326] tracking-tighter">
            Crie sua conta gratuita
          </h1>
          <p className="text-sm text-[#1b4326] font-medium opacity-80 mt-1">
            Junte-se à EnsinosTech e comece sua jornada hoje.
          </p>
        </div>

        {erro && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold animate-fadeIn">
            ⚠️ {erro}
          </div>
        )}

        {sucesso && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-bold animate-fadeIn">
            ✅ {sucesso} Redirecionando para o login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-[#1b4326] mb-1.5">Nome Completo</label>
            <input
              name="nome"
              type="text"
              placeholder="Ex: João Silva"
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-[#f2fcf5] border border-gray-200 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-[#1b4326] mb-1.5">E-mail Corporativo ou Pessoal</label>
            <input
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-[#f2fcf5] border border-gray-200 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1b4326] mb-1.5">Senha</label>
            <input
              name="senha"
              type="password"
              placeholder="••••••••"
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-[#f2fcf5] border border-gray-200 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1b4326] mb-1.5">Confirmar Senha</label>
            <input
              name="confirmarSenha"
              type="password"
              placeholder="••••••••"
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-[#f2fcf5] border border-gray-200 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 w-full bg-[#1b4326] text-white py-4 rounded-xl font-extrabold text-base hover:bg-[#112e19] transition shadow-md mt-2 flex items-center justify-center disabled:opacity-55"
          >
            {loading ? "Processando..." : "Criar Minha Conta"}
          </button>
        </form>
        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-[#1b4326] font-medium opacity-90">
            Já possui uma conta?{" "}
            <Link href="/login" className="text-[#88D66C] font-extrabold hover:underline">
              Fazer Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}