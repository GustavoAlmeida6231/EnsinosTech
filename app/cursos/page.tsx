import Link from "next/link";
import Image from "next/image";
import logoImage from "../../public/logo.png";

interface CardCursoProps {
  icone: string;
  categoria: string;
  titulo: string;
  descricao: string;
  duracao: string;
  aulas: string[];
}
function CardCursoPublico({ icone, categoria, titulo, descricao, duracao, aulas }: CardCursoProps) {
  return (
    <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#88D66C]/40 transition duration-300">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="text-5xl">{icone}</div>
          <span className="text-[10px] font-black uppercase tracking-widest bg-[#f2fcf5] text-[#1b4326] px-3 py-1 rounded-full border border-green-100">
            {categoria}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 leading-tight mb-2 group-hover:text-[#1b4326]">
          {titulo}
        </h3>
        <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
          {descricao}
        </p>

        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
          <p className="text-[10px] font-extrabold text-[#1b4326] uppercase tracking-wider mb-2">Conteúdo em Destaque:</p>
          <ul className="text-[11px] text-gray-600 space-y-1.5 font-semibold">
            {aulas.map((aula, idx) => (
              <li key={idx} className="truncate">✓ {aula}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-50 pt-5 flex items-center justify-between gap-4 mt-auto">
        <span className="text-xs text-gray-400 font-bold flex items-center gap-1">
          ⏱️ Carga: {duracao}
        </span>
        <Link 
          href="/cadastro" 
          className="bg-[#1b4326] text-white px-5 py-2.5 rounded-xl text-xs font-black hover:bg-[#112e19] transition shadow-sm text-center"
        >
          Garantir Matrícula
        </Link>
      </div>
    </div>
  );
}

export default function CursosPublic() {
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
          <Link href="/cursos" className="text-green-600 transition">Cursos</Link>
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
          Acesso Gratuito e Ilimitado
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-[#1b4326] tracking-tighter mt-4 mb-4">
          Catálogo Geral de Capacitações
        </h1>
        <p className="text-gray-600 font-semibold text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Explore os nossos cursos práticos desenvolvidos para resolver os gargalos reais do microempreendedor individual e das startups digitais.
        </p>
      </section>
      <section className="pb-40 px-8 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          
          <CardCursoPublico 
            icone="📋"
            categoria="Formalização"
            titulo="Descomplicando o MEI da Empresa"
            descricao="Domine de ponta a ponta a abertura, emissão de notas fiscais de serviços e cumprimento das regras anuais do MEI."
            duracao="4 horas"
            aulas={["Regras Gerais de Enquadramento", "Geração do CNPJ Prática", "Emissão de Notas Eletrónicas", "Guia DAS e Obrigações"]}
          />

          <CardCursoPublico 
            icone="📣"
            categoria="Marketing"
            titulo="Marketing Digital de Atração"
            descricao="Como posicionar o seu negócio de forma profissional nas redes sociais e criar funis orgânicos de captação."
            duracao="6 horas"
            aulas={["Definição de Persona e Público", "Otimização de Instagram de Negócios", "Geração de Conteúdo Descomplicado", "Métricas Básicas de Engajamento"]}
          />

          <CardCursoPublico 
            icone="🛡️"
            categoria="Segurança"
            titulo="Segurança Digital Corporativa"
            descricao="Proteja os dados estruturais da sua marca, os dados financeiros e mitigue vulnerabilidades a golpes virtuais."
            duracao="3 horas"
            aulas={["Princípios de Proteção de Dados", "Gerenciamento Seguro de Senhas", "Identificação de Phishing e Golpes", "Ativação de Fatores de Dupla Etapa"]}
          />

          <CardCursoPublico 
            icone="💰"
            categoria="Finanças"
            titulo="Gestão Financeira Prática"
            descricao="Aprenda a fazer a separação rígida entre as contas pessoais e as empresariais, mensurando o lucro líquido real."
            duracao="5 horas"
            aulas={["Conceito de Caixa vs Competência", "Separação de Contas (PF/PJ)", "Cálculo de Margem de Lucro", "Construção de Fluxo de Caixa"]}
          />

          <CardCursoPublico 
            icone="🌱"
            categoria="Planeamento"
            titulo="Modelagem de Negócios (Canvas)"
            descricao="Valide as suas hipóteses de mercado desenhando toda a sua operação estratégica em apenas uma página visual."
            duracao="4 horas"
            aulas={["Proposta de Valor e Diferencial", "Estruturação de Canais e Relações", "Mapeamento de Fontes de Receita", "Estrutura de Custos de Operação"]}
          />

          <CardCursoPublico 
            icone="🏦"
            categoria="Abertura PJ"
            titulo="Bancos Digitais e Contas Jurídicas"
            descricao="Entenda o cenário bancário moderno e aprenda a escolher as melhores plataformas livres de tarifas para gerir capital."
            duracao="2 horas"
            aulas={["Análise Comparativa de Bancos", "Processo de Abertura da Conta PJ", "Gestão de Recebíveis e Links", "Taxas de Cartão e Meios de Pagamento"]}
          />

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