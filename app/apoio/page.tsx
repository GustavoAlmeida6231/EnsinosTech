import Link from "next/link";
import Image from "next/image";
import logoImage from "../../public/logo.png";

export default function ApoioPublic() {
  return (
    <main className="min-h-screen bg-[#f4f5f4] relative font-sans overflow-x-hidden">
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 p-4 px-12 flex justify-between items-center shadow-sm">
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
          <Link href="/comunidade" className="hover:text-green-600 transition">Comunidade</Link>
          <Link href="/apoio" className="text-green-600 transition">Apoio</Link>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="bg-transparent text-[#1b4326] px-5 py-2 rounded-lg text-sm font-bold hover:bg-black/5 transition flex items-center justify-center">Entrar</Link>
          <Link href="/cadastro" className="bg-[#88D66C] text-[#1b4326] px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#6ab350] transition shadow flex items-center justify-center">Cadastrar-se</Link>
        </div>
      </nav>
      <section className="pt-32 pb-20 px-8 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1b4326] tracking-tighter mb-4">Como podemos ajudar?</h1>
            <p className="text-gray-600 font-medium text-lg">Central de Ajuda e Dúvidas Frequentes do Conecta Empreendedor.</p>
          </div>
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-[#1b4326] mb-8">Dúvidas Frequentes (FAQ)</h2>
            
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-6">
                <h3 className="font-bold text-gray-800 text-lg mb-2">A plataforma é realmente 100% gratuita?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Sim. O Conecta Empreendedor é um projeto desenvolvido com propósitos educacionais (UPx 5) e todo o material de qualificação para microempreendedores é fornecido de forma gratuita.</p>
              </div>
              
              <div className="border-b border-gray-100 pb-6">
                <h3 className="font-bold text-gray-800 text-lg mb-2">Eu preciso ter CNPJ para me cadastrar?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Não! A plataforma foi feita exatamente para quem ainda atua na informalidade e deseja aprender o passo a passo para abrir o seu MEI com segurança.</p>
              </div>

              <div className="border-b border-gray-100 pb-6">
                <h3 className="font-bold text-gray-800 text-lg mb-2">Esqueci a minha senha, como acesso os meus cursos?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Basta ir até a página de Login e clicar em "Esqueci a minha senha". Enviaremos um link de recuperação diretamente para o seu e-mail cadastrado.</p>
              </div>
            </div>

            <div className="mt-12 bg-[#f2fcf5] p-6 rounded-2xl border border-green-100 text-center">
              <h3 className="font-bold text-[#1b4326] mb-2">Ainda precisa de suporte técnico?</h3>
              <p className="text-sm text-gray-600 mb-4">Entre em contato com a equipe de monitoria do projeto.</p>
              <a href="mailto:suporte@ensinostech.com" className="inline-block bg-[#1b4326] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#112e19] transition">
                Enviar E-mail para o Suporte
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}