import Link from "next/link";
import Image from "next/image";
import logoImage from "../../public/logo.png";
import bg2Image from "../../public/backg.png";
import { criarConta } from "../../action/auth";

export default function Cadastro() {
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

                <form action={criarConta} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-[#1b4326] mb-1.5">Nome Completo</label>
                        <input
                            name="nome"
                            type="text"
                            placeholder="Ex: João Silva"
                            required
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
                            className="w-full px-4 py-3 rounded-xl bg-[#f2fcf5] border border-gray-200 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition"
                        />
                    </div>

                    <button type="submit" className="md:col-span-2 w-full bg-[#1b4326] text-white py-4 rounded-xl font-extrabold text-base hover:bg-[#112e19] transition shadow-md mt-2">
                        Criar Minha Conta
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