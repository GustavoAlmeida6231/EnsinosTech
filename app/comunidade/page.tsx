import Link from "next/link";
import Image from "next/image";
import logoImage from "../../public/logo.png";
interface TopicoProps {
  categoria: string;
  titulo: string;
  autor: string;
  tempo: string;
  respostas: number;
}

function TopicoForum({ categoria, titulo, autor, tempo, respostas }: TopicoProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <span className="text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 px-2 py-1 rounded-md mb-2 inline-block">
          {categoria}
        </span>
        <h4 className="text-sm font-bold text-[#1b4326] mb-1">{titulo}</h4>
        <p className="text-[11px] text-gray-400 font-medium">Por <span className="text-gray-600 font-bold">{autor}</span> • {tempo}</p>
      </div>
      <div className="bg-[#f2fcf5] text-[#1b4326] px-4 py-2 rounded-xl text-xs font-bold border border-green-100 flex-shrink-0 text-center">
        {respostas} respostas
      </div>
    </div>
  );
}

export default function ComunidadePublic() {
  return (
    <main className="min-h-screen bg-[#f4f5f4] relative font-sans overflow-x-hidden">
      <nav className="fixed top-0 left-0 w-full bg-white/60 backdrop-blur-md z-50 p-4 px-12 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="relative w-16 h-16 -my-4">
            <Image src={logoImage} alt="Logo EnsinosTech" fill className="object-contain" />
          </div>
          <Link href="/" className="text-2xl font-extrabold text-[#1b4326] tracking-tight mt-1">
            EnsinosTech
          </Link>
        </div>
        
        <div className="hidden md:flex gap-8 text-[#1b4326] text-sm font-bold">
          <Link href="/trilhas" className="hover:text-green-600 transition">Trilhas</Link>
          <Link href="/cursos" className="hover:text-green-600 transition">Cursos</Link>
          <Link href="/comunidade" className="text-green-600 transition border-b-2 border-green-600 pb-1">Comunidade</Link>
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
      <section className="pt-32 pb-16 px-8 lg:px-24 max-w-7xl mx-auto">
        <div className="bg-[#1b4326] rounded-[3rem] p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-[#2a6338] rounded-full blur-3xl opacity-60 z-0"></div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#88D66C] rounded-full blur-3xl opacity-20 z-0"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="text-6xl mb-6 drop-shadow-lg">🤝</div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-tight">
              O ecossistema perfeito para quem não quer crescer sozinho.
            </h1>
            <p className="text-base md:text-lg font-medium text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto">
              O projeto Conecta Empreendedor possui um fórum exclusivo. Troque experiências, valide as suas ideias, crie parcerias locais e tire dúvidas práticas com quem vive a mesma realidade que você.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/cadastro" className="bg-[#88D66C] text-[#1b4326] px-10 py-4 rounded-xl font-black text-sm hover:bg-[#7bc260] transition shadow-lg">
                Juntar-me à Comunidade Agora
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="pb-16 px-8 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4 bg-[#f2fcf5] w-20 h-20 mx-auto rounded-full flex items-center justify-center">💬</div>
            <h4 className="font-extrabold text-[#1b4326] text-lg mb-3">Fóruns Temáticos</h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">Salas de discussão organizadas por assuntos. Vá direto ao ponto nas categorias de Marketing, Finanças e Burocracias do MEI.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4 bg-[#f2fcf5] w-20 h-20 mx-auto rounded-full flex items-center justify-center">🌎</div>
            <h4 className="font-extrabold text-[#1b4326] text-lg mb-3">Networking Local</h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">Conecte-se com pequenos empresários da sua cidade para criar colaborações, indicações mútuas e vendas cruzadas.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4 bg-[#f2fcf5] w-20 h-20 mx-auto rounded-full flex items-center justify-center">👩‍🏫</div>
            <h4 className="font-extrabold text-[#1b4326] text-lg mb-3">Apoio de Monitores</h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">Ficou bloqueado nalguma aula? Os nossos monitores do projeto estão ativos no fórum para ajudar a ultrapassar qualquer obstáculo técnico.</p>
          </div>
        </div>
      </section>
      <section className="pb-40 px-8 lg:px-24 max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black text-[#1b4326] tracking-tighter">O que está a rolar agora 🔥</h2>
            <p className="text-sm text-gray-500 font-medium mt-1">Dê uma vista de olhos nas discussões mais ativas desta semana.</p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-200 flex flex-col gap-4 relative">
          
          <TopicoForum 
            categoria="Legislação & MEI" 
            titulo="Nova regra de emissão de NFSe pelo portal nacional. Alguém já conseguiu?" 
            autor="Carlos Almeida" 
            tempo="Há 2 horas" 
            respostas={14} 
          />
          <TopicoForum 
            categoria="Marketing Digital" 
            titulo="Dica de ouro: Ferramentas gratuitas para criar artes sem pagar Canva Pro" 
            autor="Mariana Silva" 
            tempo="Há 5 horas" 
            respostas={32} 
          />
          <TopicoForum 
            categoria="Networking (Belo Horizonte)" 
            titulo="Procuro fornecedor local de embalagens sustentáveis em BH!" 
            autor="Lucas Empreendimentos" 
            tempo="Há 1 dia" 
            respostas={8} 
          />
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#f4f5f4] via-[#f4f5f4]/90 to-transparent flex flex-col items-center justify-end pb-8 rounded-b-[2rem]">
            <Link href="/cadastro" className="bg-white border-2 border-[#1b4326] text-[#1b4326] px-8 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition shadow-sm">
              Inicie sessão para ler e participar →
            </Link>
          </div>
        </div>
      </section>
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