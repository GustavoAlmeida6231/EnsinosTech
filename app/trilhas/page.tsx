import Link from "next/link";
import Image from "next/image";
import logoImage from "../../public/logo.png";

interface CardModuloProps {
  numero: string;
  titulo: string;
  descricao: string;
}
function CardModulo({ numero, titulo, descricao }: CardModuloProps) {
  return (
    <div className="flex gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      <div className="w-8 h-8 bg-[#1b4326] text-white rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0">
        {numero}
      </div>
      <div>
        <h4 className="font-bold text-gray-800 text-sm">{titulo}</h4>
        <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-0.5">{descricao}</p>
      </div>
    </div>
  );
}

export default function TrilhasPublic() {
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
          <Link href="/trilhas" className="text-green-600 transition">Trilhas</Link>
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
      <section className="pt-32 pb-12 px-8 lg:px-24 max-w-7xl mx-auto text-center">
        <span className="bg-[#88D66C]/20 text-[#1b4326] text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest border border-[#88D66C]/30">
          Metodologia de Ensino
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-[#1b4326] tracking-tighter mt-4 mb-4">
          Trilhas de Conhecimento Integrado
        </h1>
        <p className="text-gray-600 font-semibold text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
          Nossos caminhos de aprendizagem foram desenhados para capacitar o microempreendedor individual através de etapas lógicas, práticas e modulares.
        </p>
      </section>
      <section className="pb-40 px-8 lg:px-24 max-w-7xl mx-auto flex flex-col gap-12">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8 relative overflow-hidden">
          <div className="lg:col-span-1 flex flex-col justify-between">
            <div>
              <div className="text-5xl mb-4">🌱</div>
              <h2 className="text-2xl font-black text-[#1b4326] tracking-tight">Planeamento de Negócios</h2>
              <p className="text-xs text-gray-500 font-medium leading-relaxed mt-2 mb-6">
                Aprenda a estruturar a base estratégica do seu empreendimento digital. Ideal para validar ideias antes de investir capital financeiro.
              </p>
            </div>
            <div className="flex flex-col gap-2 border-t border-gray-50 pt-4">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Carga Horária: <span className="text-gray-700 font-black">4 horas</span></span>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Nível: <span className="text-gray-700 font-black">Iniciante Absoluto</span></span>
            </div>
          </div>
          <div className="lg:col-span-2 bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col gap-4">
            <h3 className="text-xs font-extrabold text-[#1b4326] uppercase tracking-wider mb-1">Módulos inclusos no plano de estudo:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CardModulo numero="1" titulo="Mentalidade Empreendedora" descricao="Como identificar oportunidades reais no mercado digital." />
              <CardModulo numero="2" titulo="Metodologia Canvas na Prática" descricao="Monte o quadro estratégico do seu modelo de negócio de forma visual." />
              <CardModulo numero="3" titulo="Análise de Concorrência Inicial" descricao="Mapeie os pontos fortes e fracos dos concorrentes sem mistério." />
              <CardModulo numero="4" titulo="Validação Mínima de Produto (MVP)" descricao="Como testar o interesse do público antes do lançamento oficial." />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8 relative overflow-hidden">
          <div className="lg:col-span-1 flex flex-col justify-between">
            <div>
              <div className="text-5xl mb-4">📋</div>
              <h2 className="text-2xl font-black text-[#1b4326] tracking-tight">Formalização & Legislação</h2>
              <p className="text-xs text-gray-500 font-medium leading-relaxed mt-2 mb-6">
                Saia da informalidade com segurança. Guia definitivo para o registo, manutenção e cumprimento das obrigações do MEI.
              </p>
            </div>
            <div className="flex flex-col gap-2 border-t border-gray-50 pt-4">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Carga Horária: <span className="text-gray-700 font-black">5 horas</span></span>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Nível: <span className="text-gray-700 font-black">Essencial de Mercado</span></span>
            </div>
          </div>
          <div className="lg:col-span-2 bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col gap-4">
            <h3 className="text-xs font-extrabold text-[#1b4326] uppercase tracking-wider mb-1">Módulos inclusos no plano de estudo:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CardModulo numero="1" titulo="Abertura do CNPJ MEI" descricao="Passo a passo no Portal do Empreendedor para gerar o seu registo." />
              <CardModulo numero="2" titulo="Emissão de Notas Fiscais" descricao="Como configurar e emitir Notas Fiscais de prestação de serviços." />
              <CardModulo numero="3" titulo="Guia DAS e Impostos Mensais" descricao="Entenda o que é o DAS e mantenha os seus pagamentos em dia." />
              <CardModulo numero="4" titulo="Declaração Anual (DASN-SIMEI)" descricao="Como fazer a prestação de contas anual de faturamento com a lei." />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8 relative overflow-hidden">
          <div className="lg:col-span-1 flex flex-col justify-between">
            <div>
              <div className="text-5xl mb-4">📣</div>
              <h2 className="text-2xl font-black text-[#1b4326] tracking-tight">Marketing de Atração</h2>
              <p className="text-xs text-gray-500 font-medium leading-relaxed mt-2 mb-6">
                Aprenda a posicionar a sua marca nas redes sociais e crie canais digitais de venda orgânica estruturada.
              </p>
            </div>
            <div className="flex flex-col gap-2 border-t border-gray-50 pt-4">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Carga Horária: <span className="text-gray-700 font-black">6 horas</span></span>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Nível: <span className="text-gray-700 font-black">Prático / Comercial</span></span>
            </div>
          </div>
          <div className="lg:col-span-2 bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col gap-4">
            <h3 className="text-xs font-extrabold text-[#1b4326] uppercase tracking-wider mb-1">Módulos inclusos no plano de estudo:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CardModulo numero="1" titulo="Criação de Identidade de Marca" descricao="Conceitos básicos de design, paleta de cores e consistência visual." />
              <CardModulo numero="2" titulo="Instagram Estruturado" descricao="Otimize a sua bio, destaques e aprenda a criar publicações de valor." />
              <CardModulo numero="3" titulo="WhatsApp Business Comercial" descricao="Use catálogos, mensagens automatizadas e etiquetas de venda." />
              <CardModulo numero="4" titulo="Produção de Conteúdo Simples" descricao="Como planear um calendário de postagens sem perder tempo." />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8 relative overflow-hidden">
          <div className="lg:col-span-1 flex flex-col justify-between">
            <div>
              <div className="text-5xl mb-4">🛡️</div>
              <h2 className="text-2xl font-black text-[#1b4326] tracking-tight">Segurança Cibernética</h2>
              <p className="text-xs text-gray-500 font-medium leading-relaxed mt-2 mb-6">
                Proteja a integridade digital da sua empresa. Evite fraudes, golpes financeiros e garanta a guarda de dados confidenciais.
              </p>
            </div>
            <div className="flex flex-col gap-2 border-t border-gray-50 pt-4">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Carga Horária: <span className="text-gray-700 font-black">3 horas</span></span>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Nível: <span className="text-gray-700 font-black">Proteção Essencial</span></span>
            </div>
          </div>
          <div className="lg:col-span-2 bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col gap-4">
            <h3 className="text-xs font-extrabold text-[#1b4326] uppercase tracking-wider mb-1">Módulos inclusos no plano de estudo:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CardModulo numero="1" titulo="Higiene de Senhas e Acessos" descricao="Como criar credenciais fortes e ativar a autenticação em duas etapas." />
              <CardModulo numero="2" titulo="Prevenção contra Phishing" descricao="Aprenda a identificar e-mails, links e mensagens falsas de bancos." />
              <CardModulo numero="3" titulo="Segurança com o PIX" descricao="Boas práticas comerciais para evitar fraudes em transações instantâneas." />
              <CardModulo numero="4" titulo="Introdução à Proteção de Dados" descricao="Como cuidar das informações dos clientes em conformidade básica." />
            </div>
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