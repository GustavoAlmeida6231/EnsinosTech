import Link from "next/link";
import Image from "next/image";
import logoImage from "../../public/logo.png";
import bg2Image from "../../public/backg.png";

export default function Login() {
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
          <span className="ml-3 text-[#f2fcf5] font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            Voltar
          </span>
        </Link>
      </div>
      <div className="relative z-10 bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 transition-all">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="relative w-16 h-16 mb-4">
            <Image src={logoImage} alt="Logo EnsinosTech" fill className="object-contain" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1b4326] tracking-tighter">
            Acesse sua conta
          </h1>
          <p className="text-sm text-[#1b4326] font-medium opacity-80 mt-1">
            Seu próximo passo começa aqui. Bem-vindo de volta!
          </p>
        </div>
        <form className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-bold text-[#1b4326] mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-xl bg-[#f2fcf5] border border-gray-200 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1b4326] mb-1.5">
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[#f2fcf5] border border-gray-200 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition"
            />
            <div className="flex justify-end mt-2.5">
              <a href="#" className="text-xs font-extrabold text-[#1b4326] hover:underline">
                Esqueceu a senha?
              </a>
            </div>
          </div>

          <Link href="/dashboard" className="w-full bg-[#1b4326] text-white py-3.5 rounded-xl font-extrabold text-base hover:bg-[#112e19] transition shadow-md mt-4 flex items-center justify-center">
            Entrar
          </Link>
        </form>
        <div className="flex flex-col items-center gap-4 mt-10">
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">ou</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <button className="flex items-center justify-center gap-3 w-full border border-gray-300 py-3 rounded-lg font-bold text-[#1b4326] hover:bg-neutral-50 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Entrar com Google
          </button>
        </div>
        <div className="mt-10 text-center">
          <p className="text-sm text-[#1b4326] font-medium opacity-90 lowercase leading-snug">
            Ainda não tem conta?{" "}
            <br />
            <Link href="/cadastro" className="text-[#88D66C] font-extrabold text-base hover:underline">
              Crie sua conta gratuitamente
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}