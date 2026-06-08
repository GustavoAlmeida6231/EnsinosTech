import Link from "next/link";
import Image from "next/image";
import bgImage from "../public/background.png";
import logoImage from "../public/logo.png";

interface PathwayCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function PathwayCard({ icon, title, description }: PathwayCardProps) {
  return (
    <div className="bg-[#f2fcf5] p-5 rounded-[2rem] flex flex-col items-center text-center shadow-lg transition-transform hover:scale-105 border border-white/60">
      <div className="text-5xl mb-4 drop-shadow-md">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[#111827] mb-2 lowercase tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-[#111827] font-semibold leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white relative font-sans overflow-x-hidden">
      <nav className="fixed top-0 left-0 w-full bg-white/60 backdrop-blur-md z-50 p-4 px-12 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="relative w-20 h-20 -my-4">
            <Image
              src={logoImage}
              alt="Logo EnsinosTech"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-2xl font-extrabold text-[#1b4326] tracking-tight mt-1">
            EnsinosTech
          </span>
        </div>

        <div className="hidden md:flex gap-8 text-[#1b4326] text-sm font-bold">
          <Link href="/trilhas" className="hover:text-green-600 transition">Trilhas</Link>
          <Link href="/cursos" className="hover:text-green-600 transition">Cursos</Link>
          <Link href="/comunidade" className="hover:text-green-600 transition">Comunidade</Link>
          <Link href="/apoio" className="hover:text-green-600 transition">Apoio</Link>
        </div>

        <div className="flex gap-3">
          <Link href="/login" className="bg-transparent text-[#1b4326] px-5 py-2 rounded-lg text-sm font-bold hover:bg-black/5 transition flex items-center justify-center">
            Entrar
          </Link>
          <Link href="/cadastro" className="bg-[#88D66C] text-[#1b4326] px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#6ab350] transition shadow flex items-center justify-center">
            Cadastrar-se
          </Link>
        </div>
      </nav>
      <section className="relative min-h-screen pt-24 pb-32 flex flex-col justify-center">

        <div className="absolute inset-0 z-0">
          <Image
            src={bgImage}
            alt="Fundo da equipe de reunião"
            fill
            className="object-cover object-right"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/20 to-transparent w-full md:w-2/3"></div>
        </div>

        <div className="relative w-full lg:w-3/5 p-8 lg:p-20 z-20">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-[#1a3d24] mb-6 tracking-tighter">
            Aprenda. Planeje. <br />
            <span className="text-[#205e32]">Construa o seu Futuro.</span>
          </h1>
          <p className="text-xl text-[#1a3d24] mb-8 leading-relaxed font-bold max-w-xl">
            Conhecimento pratico para transformar ideias em negocios de sucesso
          </p>

          <div className="flex flex-wrap gap-4 mb-14">
            <button className="bg-[#1b4326] text-white px-8 py-3 rounded-lg text-base font-bold hover:bg-[#112e19] transition shadow-md">
              Começar Agora
            </button>
            <button className="bg-[#dbe0dd] text-[#1b4326] px-8 py-3 rounded-lg text-base font-bold hover:bg-[#c4cbc7] transition shadow-md">
              Ver como funciona
            </button>
          </div>

          <div className="flex flex-wrap gap-8 text-[#1b4326] font-bold text-sm mb-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl drop-shadow-sm">✅</span> Conteúdo pratico e atualizado
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl drop-shadow-sm">⏱️</span> Aprender no seu ritmo
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl drop-shadow-sm">🎓</span> Certificado ao final dos cursos
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-[#1b4326] mb-1 tracking-tighter">
              Escolha o seu caminho de aprendizado
            </h2>
            <p className="text-[#1b4326] mb-8 font-bold text-sm">
              Explore nossas trilhas e desenvolva habilidades essenciais para o seu negocio
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              <PathwayCard icon="🌱" title="como começar" description="Dê os primeiros passos e transforme sua ideia em um plano." />
              <PathwayCard icon="📣" title="marketing" description="Aprenda a divulgar seu negócio e atrair mais clientes." />
              <PathwayCard icon="🛡️" title="segurança" description="Proteja seus dados, seu dinheiro e seu negócio." />
              <PathwayCard icon="🏦" title="abertura main" description="Descubra como abrir sua conta PJ de forma simples." />
              <PathwayCard icon="📋" title="formalização" description="Formalize seu negócio e esteja em dia com a lei." />
              <PathwayCard icon="📚" title="cursos" description="Acesse todos os cursos disponíveis e continue aprendendo." />
            </div>
          </div>
        </div>
      </section>
      <div className="fixed bottom-24 right-8 z-50">
        <div className="w-10 h-10 bg-[#0c3689] rounded-md shadow-xl flex items-center justify-center text-white cursor-pointer hover:bg-blue-900 transition">
          <span className="font-bold text-lg">L</span>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-[#3b6b47] h-20 flex justify-center items-center z-40 border-t border-[#2e5c3a]">
        <div className="flex items-center">
          <div className="flex items-center gap-4 pr-6">
            <div className="text-right text-white">
              <p className="font-bold text-[15px] lowercase">ainda não tem cadastro?</p>
              <p className="text-[12px] lowercase opacity-90">crie sua conta gratuitamente e tenha acesso a todo conteudo</p>
            </div>
            <Link href="/cadastro" className="bg-[#88D66C] text-[#1b4326] px-5 py-2 rounded-md text-sm font-bold hover:bg-[#7bc260] transition shadow-sm flex items-center justify-center">
              Criar Conta Grátis
            </Link>
          </div>
          <div className="w-10 h-10 bg-[#f4f5f4] rounded-full flex items-center justify-center z-10 relative shadow-md">
            <span className="font-extrabold text-[#1b4326] text-sm">ou</span>
          </div>
          <div className="bg-[#f4f5f4] flex items-center gap-6 pl-8 pr-4 py-3 rounded-r-2xl -ml-5 shadow-inner">
            <div className="text-left text-[#1b4326]">
              <p className="font-bold text-[15px] lowercase">já tem uma conta?</p>
              <p className="text-[12px] lowercase opacity-80">faça o login e continue sua jornada</p>
            </div>
            <Link href="/login" className="bg-white border border-gray-200 text-[#1b4326] px-6 py-2 rounded-md text-sm font-bold hover:bg-gray-50 transition shadow-sm flex items-center justify-center">
              Entrar
            </Link>
          </div>

        </div>
      </div>

    </main>
  );
}