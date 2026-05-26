"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logoImage from "../../public/logo.png";

interface Aula {
  id: string;
  titulo: string;
  duracao: string;
}

interface Curso {
  id: string;
  categoria: string;
  titulo: string;
  descricao: string;
  icone: string;
  aulas: Aula[];
}

interface PerfilUsuario {
  nome: string;
  email: string;
  empresa: string;
  papel: string;
}

export default function Dashboard() {
  const [abaAtiva, setAbaAtiva] = useState<"painel" | "cursos" | "configuracoes">("painel");
  const [cursoSelecionadoId, setCursoSelecionadoId] = useState<string | null>(null);
  const [perfil, setPerfil] = useState<PerfilUsuario>({
    nome: "Gustavo de Paula",
    email: "gustav.21x@gmail.com",
    empresa: "EnsinosTech Consultoria",
    papel: "Administrador / Empreendedor",
  });
  const [listaCursos] = useState<Curso[]>([
    {
      id: "c1",
      categoria: "Formalização",
      titulo: "Descomplicando o MEI da Empresa",
      descricao: "Passo a passo completo para abertura, emissão de notas e obrigações legais sem burocracia.",
      icone: "📋",
      aulas: [
        { id: "a1-1", titulo: "Introdução ao MEI e Regras Gerais", duracao: "15 min" },
        { id: "a1-2", titulo: "Documentação Necessária para Abertura", duracao: "22 min" },
        { id: "a1-3", titulo: "Emitindo sua Primeira Nota Fiscal Eletrônica", duracao: "30 min" },
      ],
    },
    {
      id: "c2",
      categoria: "Marketing",
      titulo: "Marketing Digital de Atração",
      descricao: "Como estruturar o posicionamento digital da sua marca para atrair clientes organicamente.",
      icone: "📣",
      aulas: [
        { id: "a2-1", titulo: "Definição de Público-Alvo e Persona", duracao: "18 min" },
        { id: "a2-2", titulo: "Configurando Redes Sociais Profissionais", duracao: "25 min" },
        { id: "a2-3", titulo: "Estratégias Básicas de Tráfego Orgânico", duracao: "20 min" },
      ],
    },
    {
      id: "c3",
      categoria: "Segurança",
      titulo: "Segurança Digital Corporativa",
      descricao: "Proteção de dados críticos, engenharia social e conformidade essencial para microempresas.",
      icone: "🛡️",
      aulas: [
        { id: "a3-1", titulo: "Princípios da Segurança da Informação", duracao: "12 min" },
        { id: "a3-2", titulo: "Gerenciamento Seguro de Senhas e Acessos", duracao: "19 min" },
        { id: "a3-3", titulo: "Evitando Golpes Comuns no Meio Digital", duracao: "28 min" },
      ],
    },
  ]);
  const [cursosInscritos, setCursosInscritos] = useState<string[]>(["c1"]);
  const [aulasConcluidas, setAulasConcluidas] = useState<string[]>(["a1-1"]);

  // Funções de Inscrição
  const alternarInscricao = (cursoId: string) => {
    if (cursosInscritos.includes(cursoId)) {
      setCursosInscritos(cursosInscritos.filter((id) => id !== cursoId));
      if (cursoSelecionadoId === cursoId) setCursoSelecionadoId(null);
    } else {
      setCursosInscritos([...cursosInscritos, cursoId]);
    }
  };
  const alternarAulaConcluida = (aulaId: string) => {
    if (aulasConcluidas.includes(aulaId)) {
      setAulasConcluidas(aulasConcluidas.filter((id) => id !== aulaId));
    } else {
      setAulasConcluidas([...aulasConcluidas, aulaId]);
    }
  };

  const calcularProgressoCurso = (curso: Curso) => {
    const aulasDoCurso = curso.aulas.map((a) => a.id);
    const concluidasNoCurso = aulasDoCurso.filter((id) => aulasConcluidas.includes(id));
    if (aulasDoCurso.length === 0) return 0;
    return Math.round((concluidasNoCurso.length / aulasDoCurso.length) * 100);
  };

  const totalAulasExistentes = listaCursos.reduce((acc, c) => acc + c.aulas.length, 0);
  const progressoGeralPlataforma = Math.round((aulasConcluidas.length / totalAulasExistentes) * 100);
  const cursoAtivoParaExibicao = listaCursos.find((c) => c.id === cursoSelecionadoId);
  const cursosAtivos = listaCursos.filter(c => cursosInscritos.includes(c.id));
  const cursosSugeridos = listaCursos.filter(c => !cursosInscritos.includes(c.id));

  return (
    <main className="min-h-screen bg-[#f4f5f4] flex font-sans antialiased text-gray-800">
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10 shadow-sm">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="relative w-10 h-10 -my-2">
            <Image src={logoImage} alt="Logo" fill className="object-contain" />
          </div>
          <span className="text-xl font-extrabold text-[#1b4326] tracking-tight">EnsinosTech</span>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1.5">
          <button
            onClick={() => { setAbaAtiva("painel"); setCursoSelecionadoId(null); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition text-left w-full ${
              abaAtiva === "painel" && !cursoSelecionadoId
                ? "bg-[#f2fcf5] text-[#1b4326]"
                : "text-gray-600 hover:bg-gray-50 hover:text-[#1b4326]"
            }`}
          >
            <span className="text-xl">📊</span> Painel de Estudos
          </button>

          <button
            onClick={() => { setAbaAtiva("cursos"); setCursoSelecionadoId(null); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition text-left w-full ${
              abaAtiva === "cursos"
                ? "bg-[#f2fcf5] text-[#1b4326]"
                : "text-gray-600 hover:bg-gray-50 hover:text-[#1b4326]"
            }`}
          >
            <span className="text-xl">📚</span> Todos os Cursos
          </button>

          <button
            onClick={() => { setAbaAtiva("configuracoes"); setCursoSelecionadoId(null); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition text-left w-full ${
              abaAtiva === "configuracoes"
                ? "bg-[#f2fcf5] text-[#1b4326]"
                : "text-gray-600 hover:bg-gray-50 hover:text-[#1b4326]"
            }`}
          >
            <span className="text-xl">⚙️</span> Configurações
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-full bg-[#1b4326] flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
              {perfil.nome.substring(0, 2)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-[#1b4326] truncate">{perfil.nome}</span>
              <Link href="/" className="text-[10px] text-red-500 font-extrabold hover:underline">Sair da Plataforma</Link>
            </div>
          </div>
        </div>
      </aside>
      <div className="flex-1 ml-72 p-8 lg:p-10">
        {abaAtiva === "painel" && !cursoSelecionadoId && (
          <div className="max-w-[1400px] mx-auto animate-fadeIn">
            
            <header className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-extrabold text-[#1b4326] tracking-tighter">Seu Espaço de Estudos</h1>
                <p className="text-sm text-gray-500 font-semibold mt-0.5">Acompanhe seu avanço no projeto Conecta Empreendedor.</p>
              </div>
              <div className="bg-white border border-gray-200 text-[#1b4326] px-4 py-2 rounded-xl text-xs font-bold shadow-sm hidden md:block">
                Ambiente Acadêmico UPx 5
              </div>
            </header>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f2fcf5] text-[#1b4326] rounded-xl flex items-center justify-center text-2xl">🔥</div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Progresso Geral</p>
                      <p className="text-xl font-black text-[#1b4326]">{progressoGeralPlataforma}% concluído</p>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl">📖</div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Aulas Assistidas</p>
                      <p className="text-xl font-black text-gray-800">{aulasConcluidas.length} de {totalAulasExistentes}</p>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center text-2xl">🏆</div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Certificados</p>
                      <p className="text-xl font-black text-gray-800">{cursosAtivos.filter(c => calcularProgressoCurso(c) === 100).length} emitidos</p>
                    </div>
                  </div>
                </div>
                {cursosAtivos.length > 0 && (
                  <div className="bg-[#1b4326] rounded-[2rem] p-8 flex flex-col md:flex-row justify-between items-center text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-72 h-72 bg-[#2a6338] rounded-full blur-3xl opacity-60 z-0"></div>
                    <div className="relative z-10 w-full md:w-2/3">
                      <span className="bg-[#88D66C] text-[#1b4326] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                        Continue Aprendendo
                      </span>
                      <h2 className="text-3xl font-bold mb-2 tracking-tight">{cursosAtivos[0].titulo}</h2>
                      <p className="text-white/80 text-sm mb-6 leading-relaxed">
                        Retome seus estudos e finalize a próxima aula para dar mais um passo na formalização do seu negócio.
                      </p>
                      <button 
                        onClick={() => setCursoSelecionadoId(cursosAtivos[0].id)}
                        className="bg-white text-[#1b4326] px-8 py-3 rounded-xl text-sm font-bold hover:bg-gray-100 transition shadow"
                      >
                        Retomar Trilha →
                      </button>
                    </div>
                    <div className="relative z-10 hidden md:flex text-8xl opacity-20">
                      {cursosAtivos[0].icone}
                    </div>
                  </div>
                )}
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <h2 className="text-xl font-extrabold text-[#1b4326] tracking-tighter">Suas Trilhas Ativas</h2>
                  </div>
                  
                  {cursosAtivos.length === 0 ? (
                    <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-10 text-center flex flex-col items-center">
                      <div className="text-5xl mb-4">👀</div>
                      <h3 className="text-lg font-bold text-[#1b4326] mb-2">Você ainda não está inscrito em nenhuma trilha</h3>
                      <p className="text-sm text-gray-500 mb-6 max-w-md">Para começar a aprender e gerenciar seu progresso, escolha um curso no catálogo.</p>
                      <button 
                        onClick={() => setAbaAtiva("cursos")}
                        className="bg-[#1b4326] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#112e19] transition shadow-sm"
                      >
                        Explorar Catálogo de Cursos
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {cursosAtivos.map((curso) => {
                        const progresso = calcularProgressoCurso(curso);
                        return (
                          <div 
                            key={curso.id} 
                            onClick={() => setCursoSelecionadoId(curso.id)}
                            className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#88D66C]/50 transition cursor-pointer group"
                          >
                            <div>
                              <div className="flex justify-between items-start mb-4">
                                <div className="text-4xl group-hover:scale-110 transition-transform">{curso.icone}</div>
                                <span className="text-[10px] font-black uppercase tracking-widest bg-[#f2fcf5] text-[#1b4326] px-2.5 py-1 rounded-full border border-green-100">
                                  {curso.categoria}
                                </span>
                              </div>
                              <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#1b4326] transition-colors line-clamp-1">{curso.titulo}</h3>
                              <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1.5 line-clamp-2">{curso.descricao}</p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-50">
                              <div className="flex justify-between items-center text-xs font-bold text-gray-500 mb-1.5">
                                <span>Progresso</span>
                                <span className="text-[#1b4326] font-extrabold">{progresso}%</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div className="bg-[#88D66C] h-1.5 rounded-full transition-all duration-500" style={{ width: `${progresso}%` }}></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div className="xl:col-span-1 flex flex-col gap-6">
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="text-sm font-extrabold text-[#1b4326] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span>🔔</span> Mural de Avisos
                  </h3>
                  <div className="space-y-4">
                    <div className="border-l-2 border-[#88D66C] pl-3">
                      <p className="text-xs font-bold text-gray-800">Novos Módulos de Marketing</p>
                      <p className="text-[11px] text-gray-500 mt-1">Aprenda a utilizar o tráfego pago nas redes sociais na nova atualização.</p>
                      <span className="text-[9px] font-bold text-[#1b4326] uppercase mt-1 block">Há 2 horas</span>
                    </div>
                    <div className="border-l-2 border-gray-200 pl-3">
                      <p className="text-xs font-bold text-gray-800">Mudanças no Limite do MEI</p>
                      <p className="text-[11px] text-gray-500 mt-1">Fique atento às propostas do governo para o aumento do teto de faturamento.</p>
                      <span className="text-[9px] font-bold text-gray-400 uppercase mt-1 block">Há 1 dia</span>
                    </div>
                  </div>
                  <button className="w-full text-center mt-5 text-xs font-bold text-[#1b4326] bg-gray-50 py-2 rounded-xl hover:bg-gray-100 transition">
                    Ver todos os avisos
                  </button>
                </div>
                {cursosSugeridos.length > 0 && (
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-sm font-extrabold text-[#1b4326] uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span>💡</span> Sugeridos para Você
                    </h3>
                    <div className="space-y-4">
                      {cursosSugeridos.slice(0, 2).map(curso => (
                        <div key={curso.id} className="flex gap-4 items-center p-3 rounded-2xl hover:bg-gray-50 transition cursor-pointer border border-transparent hover:border-gray-100" onClick={() => setAbaAtiva("cursos")}>
                          <div className="text-3xl bg-gray-50 p-2 rounded-xl">{curso.icone}</div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{curso.titulo}</h4>
                            <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{curso.descricao}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => setAbaAtiva("cursos")}
                      className="w-full text-center mt-4 text-xs font-bold text-white bg-[#1b4326] py-2.5 rounded-xl hover:bg-[#112e19] transition shadow-sm"
                    >
                      Explorar Mais Trilhas
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {cursoSelecionadoId && cursoAtivoParaExibicao && (
          <div className="max-w-[1200px] mx-auto animate-fadeIn">
            <button 
              onClick={() => setCursoSelecionadoId(null)}
              className="mb-6 text-sm font-bold text-[#1b4326] hover:bg-white hover:shadow-sm px-4 py-2 rounded-xl border border-transparent hover:border-gray-200 transition flex items-center gap-2"
            >
              ← Voltar para o Painel Geral
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-fit relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#88D66C]"></div>
                <div className="text-6xl mb-6">{cursoAtivoParaExibicao.icone}</div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#1b4326] bg-[#f2fcf5] px-3 py-1 rounded-full border border-green-100">
                  {cursoAtivoParaExibicao.categoria}
                </span>
                <h2 className="text-2xl font-extrabold text-[#1b4326] tracking-tight mt-4 mb-3">{cursoAtivoParaExibicao.titulo}</h2>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">{cursoAtivoParaExibicao.descricao}</p>
                
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex justify-between items-center text-sm font-bold text-gray-600 mb-3">
                    <span>Progresso da Trilha</span>
                    <span className="text-[#1b4326] font-black">{calcularProgressoCurso(cursoAtivoParaExibicao)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-[#1b4326] h-3 rounded-full transition-all duration-500" style={{ width: `${calcularProgressoCurso(cursoAtivoParaExibicao)}%` }}></div>
                  </div>
                </div>
                <button 
                  onClick={() => alternarInscricao(cursoAtivoParaExibicao.id)}
                  className="w-full mt-8 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 py-3 rounded-xl transition"
                >
                  Cancelar Inscrição neste Curso
                </button>
              </div>

              <div className="lg:col-span-2 flex flex-col gap-4">
                <h3 className="text-2xl font-extrabold text-[#1b4326] tracking-tighter mb-2">Cronograma de Aulas</h3>
                
                {cursoAtivoParaExibicao.aulas.map((aula, index) => {
                  const concluida = aulasConcluidas.includes(aula.id);
                  return (
                    <div 
                      key={aula.id}
                      className={`p-5 md:p-6 rounded-3xl border transition flex flex-col md:flex-row md:justify-between md:items-center gap-4 ${
                        concluida 
                          ? "bg-[#f2fcf5] border-green-200 shadow-sm" 
                          : "bg-white border-gray-100 shadow-sm hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm ${
                          concluida ? "bg-[#1b4326] text-white" : "bg-gray-50 text-gray-400 border border-gray-200"
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-base">{aula.titulo}</h4>
                          <span className="text-xs text-gray-500 font-bold flex items-center gap-1 mt-1">
                            ⏱️ {aula.duracao} de conteúdo
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => alternarAulaConcluida(aula.id)}
                        className={`px-6 py-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 w-full md:w-auto shadow-sm ${
                          concluida
                            ? "bg-[#1b4326] text-white hover:bg-[#112e19]"
                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {concluida ? "✓ Finalizada" : "Marcar como Feita"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {abaAtiva === "cursos" && (
          <div className="max-w-[1400px] mx-auto animate-fadeIn">
            <header className="mb-10">
              <h1 className="text-3xl font-extrabold text-[#1b4326] tracking-tighter">Catálogo de Trilhas</h1>
              <p className="text-sm text-gray-500 font-semibold mt-0.5">Explore todas as capacitações e inscreva-se para começar.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {listaCursos.map((curso) => {
                const inscrito = cursosInscritos.includes(curso.id);
                return (
                  <div key={curso.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                    <div>
                      <div className="flex justify-between items-start mb-5">
                        <div className="text-5xl">{curso.icone}</div>
                        {inscrito && (
                          <span className="bg-[#1b4326] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">Ativo</span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight">{curso.titulo}</h3>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">{curso.descricao}</p>
                    </div>
                    
                    <div className="mt-4 pt-5 border-t border-gray-50">
                      <div className="flex justify-between items-center text-xs font-bold text-gray-400 mb-4">
                        <span>{curso.aulas.length} Aulas Inclusas</span>
                        <span className="bg-gray-50 px-2 py-1 rounded-md text-gray-600">Gratuito</span>
                      </div>
                      
                      <div className="flex gap-3">
                        <button 
                          onClick={() => alternarInscricao(curso.id)}
                          className={`flex-1 py-3 rounded-xl text-xs font-bold transition shadow-sm border ${
                            inscrito 
                              ? "bg-white text-red-500 border-red-100 hover:bg-red-50" 
                              : "bg-[#1b4326] text-white border-transparent hover:bg-[#112e19]"
                          }`}
                        >
                          {inscrito ? "Cancelar Inscrição" : "Inscrever-se na Trilha"}
                        </button>

                        {inscrito && (
                          <button 
                            onClick={() => { setAbaAtiva("painel"); setCursoSelecionadoId(curso.id); }}
                            className="flex-1 bg-[#88D66C] text-[#1b4326] py-3 rounded-xl text-xs font-extrabold hover:bg-[#7bc260] transition shadow-sm border border-transparent"
                          >
                            Acessar Aulas
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {abaAtiva === "configuracoes" && (
          <div className="max-w-3xl animate-fadeIn">
            <header className="mb-8">
              <h1 className="text-3xl font-extrabold text-[#1b4326] tracking-tighter">Configurações da Conta</h1>
              <p className="text-sm text-gray-500 font-semibold mt-0.5">Gerencie seus dados de acesso e perfil de empreendedor.</p>
            </header>

            <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-[#1b4326] mb-6 border-b border-gray-50 pb-4">Dados Cadastrais</h3>
              
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Nome Completo</label>
                    <input 
                      type="text" 
                      value={perfil.nome}
                      onChange={(e) => setPerfil({...perfil, nome: e.target.value})}
                      className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:bg-white focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">E-mail de Acesso</label>
                    <input 
                      type="email" 
                      value={perfil.email}
                      onChange={(e) => setPerfil({...perfil, email: e.target.value})}
                      className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:bg-white focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Nome do Seu Negócio</label>
                  <input 
                    type="text" 
                    value={perfil.empresa}
                    onChange={(e) => setPerfil({...perfil, empresa: e.target.value})}
                    className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:bg-white focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Permissão de Sistema</label>
                  <input 
                    type="text" 
                    disabled 
                    value={perfil.papel}
                    className="w-full px-5 py-3.5 rounded-xl bg-gray-100 border border-gray-200 text-sm font-bold text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div className="border-t border-gray-100 pt-6 mt-2 flex justify-end">
                  <button 
                    type="button"
                    onClick={() => alert("Os dados do estado local foram atualizados. Quando o Prisma for configurado, usaremos um UPDATE aqui.")}
                    className="bg-[#1b4326] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-[#112e19] transition shadow-md"
                  >
                    Salvar Modificações
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}