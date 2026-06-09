"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoImage from "../../public/logo.png";
import { obterUsuarioLogado, logout, atualizarPerfil } from "../../action/auth";
import {
  listarCursos,
  obterProgressoUsuario,
  alternarInscricao,
  alternarAulaConcluida,
} from "../../action/cursos";

type TipoConteudo = "video" | "texto" | "pdf" | "quiz" | "link";

interface Questao {
  id: string;
  pergunta: string;
  opcoes: string[];
  respostaCorreta: number;
}

interface Conteudo {
  id: string;
  tipo: TipoConteudo;
  titulo: string;
  descricao?: string;
  url?: string;
  texto?: string;
  duracao?: string;
  questoes?: Questao[];
}

interface Aula {
  id: string;
  titulo: string;
  duracao: string;
  descricao?: string;
  conteudos: Conteudo[];
}

interface Curso {
  id: string;
  categoria: string;
  titulo: string;
  descricao: string;
  icone: string;
  nivel?: string;
  cargaHoraria?: string;
  aulas: Aula[];
}

interface PerfilUsuario {
  nome: string;
  email: string;
  empresa: string;
  papel: string;
}

const ICONES = ["📚", "💼", "📊", "🧾", "💡", "🏦", "📱", "🤝", "🎯", "⚖️", "🛒", "📣", "🧠", "🔧", "📐", "🌱", "🏅", "🗂️", "💻", "📝"];
const CATEGORIAS = ["Gestão", "Financeiro", "Marketing", "Jurídico", "Tecnologia", "Vendas", "Empreendedorismo", "Contabilidade", "Recursos Humanos"];
const NIVEIS = ["Iniciante", "Intermediário", "Avançado"];
const TIPOS_CONTEUDO: { valor: TipoConteudo; label: string; icone: string; cor: string }[] = [
  { valor: "video", label: "Vídeo", icone: "🎬", cor: "bg-blue-50 text-blue-700 border-blue-200" },
  { valor: "texto", label: "Texto", icone: "📝", cor: "bg-amber-50 text-amber-700 border-amber-200" },
  { valor: "pdf", label: "PDF", icone: "📄", cor: "bg-red-50 text-red-700 border-red-200" },
  { valor: "quiz", label: "Quiz", icone: "🧩", cor: "bg-purple-50 text-purple-700 border-purple-200" },
  { valor: "link", label: "Link Externo", icone: "🔗", cor: "bg-green-50 text-green-700 border-green-200" },
];

function gerarId() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function BadgeTipo({ tipo }: { tipo: TipoConteudo }) {
  const cfg = TIPOS_CONTEUDO.find(t => t.valor === tipo)!;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.cor}`}>
      {cfg.icone} {cfg.label}
    </span>
  );
}

function StatCard({ icone, label, valor, cor }: { icone: string; label: string; valor: string | number; cor: string }) {
  return (
    <div className={`${cor} rounded-2xl p-4 flex items-center gap-3`}>
      <span className="text-2xl">{icone}</span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{label}</p>
        <p className="text-lg font-black">{valor}</p>
      </div>
    </div>
  );
}

function ModalQuestao({
  questao,
  onChange,
  onRemover,
  index,
}: {
  questao: Questao;
  onChange: (q: Questao) => void;
  onRemover: () => void;
  index: number;
}) {
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-purple-700 uppercase tracking-wider">Questão {index + 1}</span>
        <button type="button" onClick={onRemover} className="text-red-400 hover:text-red-600 text-xs font-bold cursor-pointer">✕ Remover</button>
      </div>
      <input
        type="text"
        placeholder="Pergunta..."
        value={questao.pergunta}
        onChange={e => onChange({ ...questao, pergunta: e.target.value })}
        className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 text-sm font-medium text-gray-800 focus:outline-none focus:border-purple-400 transition"
      />
      <div className="grid grid-cols-2 gap-2">
        {questao.opcoes.map((op, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChange({ ...questao, respostaCorreta: i })}
              className={`w-5 h-5 rounded-full border-2 flex-shrink-0 cursor-pointer transition ${questao.respostaCorreta === i ? "bg-purple-600 border-purple-600" : "border-gray-300 bg-white hover:border-purple-400"
                }`}
              title="Marcar como correta"
            />
            <input
              type="text"
              placeholder={`Opção ${i + 1}`}
              value={op}
              onChange={e => {
                const novas = [...questao.opcoes];
                novas[i] = e.target.value;
                onChange({ ...questao, opcoes: novas });
              }}
              className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-purple-200 text-xs font-medium text-gray-700 focus:outline-none focus:border-purple-400 transition"
            />
          </div>
        ))}
      </div>
      <p className="text-[10px] text-purple-600 font-bold">● Clique no círculo para marcar a resposta correta</p>
    </div>
  );
}

function ModalConteudo({
  conteudo,
  onSalvar,
  onFechar,
}: {
  conteudo: Conteudo | null;
  onSalvar: (c: Conteudo) => void;
  onFechar: () => void;
}) {
  const [form, setForm] = useState<Conteudo>(
    conteudo ?? { id: gerarId(), tipo: "video", titulo: "", descricao: "", url: "", duracao: "", questoes: [] }
  );

  const adicionarQuestao = () => {
    setForm(f => ({
      ...f,
      questoes: [
        ...(f.questoes ?? []),
        { id: gerarId(), pergunta: "", opcoes: ["", "", "", ""], respostaCorreta: 0 },
      ],
    }));
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim()) return;
    onSalvar(form);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onFechar(); }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-fadeIn">
        <div className="bg-[#1b4326] px-7 py-6 flex items-center justify-between sticky top-0 rounded-t-3xl z-10">
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">
              {conteudo ? "Editar Conteúdo" : "Adicionar Conteúdo"}
            </h2>
            <p className="text-white/60 text-xs mt-0.5">Configure o material desta aula</p>
          </div>
          <button onClick={onFechar} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer text-sm font-bold">✕</button>
        </div>

        <form onSubmit={handleSalvar} className="p-7 flex flex-col gap-5">
          <div>
            <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Tipo de Conteúdo</label>
            <div className="flex flex-wrap gap-2">
              {TIPOS_CONTEUDO.map(t => (
                <button
                  key={t.valor}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, tipo: t.valor }))}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border-2 transition cursor-pointer ${form.tipo === t.valor ? `${t.cor} border-current scale-105 shadow-sm` : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                    }`}
                >
                  {t.icone} {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Título <span className="text-red-400">*</span></label>
            <input
              type="text"
              required
              placeholder="Ex: Introdução ao Fluxo de Caixa"
              value={form.titulo}
              onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition placeholder:font-normal placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Descrição</label>
            <textarea
              rows={2}
              placeholder="Breve descrição do conteúdo..."
              value={form.descricao ?? ""}
              onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition resize-none placeholder:font-normal placeholder:text-gray-400"
            />
          </div>

          {(form.tipo === "video" || form.tipo === "link" || form.tipo === "pdf") && (
            <div>
              <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                {form.tipo === "video" ? "URL do Vídeo (YouTube, Vimeo…)" : form.tipo === "pdf" ? "URL do PDF" : "URL do Link"}
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={form.url ?? ""}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition placeholder:font-normal placeholder:text-gray-400"
              />
            </div>
          )}

          {form.tipo === "video" && (
            <div>
              <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Duração</label>
              <input
                type="text"
                placeholder="Ex: 12 min"
                value={form.duracao ?? ""}
                onChange={e => setForm(f => ({ ...f, duracao: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition placeholder:font-normal placeholder:text-gray-400"
              />
            </div>
          )}

          {form.tipo === "texto" && (
            <div>
              <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Conteúdo do Texto</label>
              <textarea
                rows={6}
                placeholder="Escreva o conteúdo textual aqui..."
                value={form.texto ?? ""}
                onChange={e => setForm(f => ({ ...f, texto: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition resize-none placeholder:font-normal placeholder:text-gray-400"
              />
            </div>
          )}

          {form.tipo === "quiz" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Questões do Quiz</label>
                <button
                  type="button"
                  onClick={adicionarQuestao}
                  className="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 transition cursor-pointer"
                >
                  + Adicionar Questão
                </button>
              </div>
              {(form.questoes ?? []).length === 0 && (
                <div className="bg-purple-50 border border-dashed border-purple-200 rounded-2xl p-6 text-center text-xs text-purple-600 font-bold">
                  🧩 Nenhuma questão ainda. Clique em "Adicionar Questão".
                </div>
              )}
              {(form.questoes ?? []).map((q, i) => (
                <ModalQuestao
                  key={q.id}
                  questao={q}
                  index={i}
                  onChange={nq => setForm(f => ({ ...f, questoes: (f.questoes ?? []).map(x => x.id === nq.id ? nq : x) }))}
                  onRemover={() => setForm(f => ({ ...f, questoes: (f.questoes ?? []).filter(x => x.id !== q.id) }))}
                />
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onFechar} className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition cursor-pointer">Cancelar</button>
            <button type="submit" className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-[#1b4326] hover:bg-[#112e19] transition shadow-sm cursor-pointer">
              {conteudo ? "Salvar Alterações" : "✓ Adicionar Conteúdo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


function ModalAula({
  aula,
  onSalvar,
  onFechar,
}: {
  aula: Aula | null;
  onSalvar: (a: Aula) => void;
  onFechar: () => void;
}) {
  const [form, setForm] = useState<Aula>(
    aula ?? { id: gerarId(), titulo: "", duracao: "", descricao: "", conteudos: [] }
  );
  const [modalConteudo, setModalConteudo] = useState<{ aberto: boolean; conteudo: Conteudo | null }>({ aberto: false, conteudo: null });

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim()) return;
    onSalvar(form);
  };

  const salvarConteudo = (c: Conteudo) => {
    setForm(f => ({
      ...f,
      conteudos: f.conteudos.some(x => x.id === c.id)
        ? f.conteudos.map(x => x.id === c.id ? c : x)
        : [...f.conteudos, c],
    }));
    setModalConteudo({ aberto: false, conteudo: null });
  };

  const removerConteudo = (id: string) => {
    setForm(f => ({ ...f, conteudos: f.conteudos.filter(c => c.id !== id) }));
  };

  return (
    <>
      {modalConteudo.aberto && (
        <ModalConteudo
          conteudo={modalConteudo.conteudo}
          onSalvar={salvarConteudo}
          onFechar={() => setModalConteudo({ aberto: false, conteudo: null })}
        />
      )}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={e => { if (e.target === e.currentTarget) onFechar(); }}
      >
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto animate-fadeIn">
          <div className="bg-[#1b4326] px-7 py-6 flex items-center justify-between sticky top-0 rounded-t-3xl z-10">
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight">
                {aula ? "Editar Aula" : "Nova Aula"}
              </h2>
              <p className="text-white/60 text-xs mt-0.5">Configure o conteúdo desta aula</p>
            </div>
            <button onClick={onFechar} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer text-sm font-bold">✕</button>
          </div>

          <form onSubmit={handleSalvar} className="p-7 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-extrabold text-[#1b4326] uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 bg-[#1b4326] text-white rounded-full flex items-center justify-center text-[10px] font-black">1</span>
                Dados da Aula
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Título <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Introdução ao Simples Nacional"
                    value={form.titulo}
                    onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition placeholder:font-normal placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Duração</label>
                  <input
                    type="text"
                    placeholder="Ex: 45 min"
                    value={form.duracao}
                    onChange={e => setForm(f => ({ ...f, duracao: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition placeholder:font-normal placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Descrição da Aula</label>
                <textarea
                  rows={2}
                  placeholder="Explique brevemente o que o aluno vai aprender nesta aula..."
                  value={form.descricao ?? ""}
                  onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition resize-none placeholder:font-normal placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#1b4326] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#1b4326] text-white rounded-full flex items-center justify-center text-[10px] font-black">2</span>
                  Materiais da Aula
                </h3>
                <button
                  type="button"
                  onClick={() => setModalConteudo({ aberto: true, conteudo: null })}
                  className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#1b4326] hover:bg-[#112e19] px-3 py-2 rounded-xl transition cursor-pointer shadow-sm"
                >
                  + Adicionar Material
                </button>
              </div>

              {form.conteudos.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
                  <div className="text-3xl mb-2">📦</div>
                  <p className="text-sm font-bold text-gray-500">Nenhum material adicionado ainda</p>
                  <p className="text-xs text-gray-400 mt-1">Adicione vídeos, textos, PDFs, quizzes ou links externos</p>
                  <button
                    type="button"
                    onClick={() => setModalConteudo({ aberto: true, conteudo: null })}
                    className="mt-4 text-xs font-bold text-[#1b4326] bg-[#f2fcf5] hover:bg-green-100 px-4 py-2 rounded-xl border border-green-200 transition cursor-pointer"
                  >
                    + Adicionar Primeiro Material
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {form.conteudos.map((c, idx) => (
                    <div key={c.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-between gap-3 group hover:border-gray-300 transition">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-gray-400 text-xs font-bold w-5 text-center">{idx + 1}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <BadgeTipo tipo={c.tipo} />
                            {c.duracao && <span className="text-[10px] text-gray-400 font-bold">⏱ {c.duracao}</span>}
                          </div>
                          <p className="text-sm font-bold text-gray-800 mt-1 truncate">{c.titulo}</p>
                          {c.descricao && <p className="text-xs text-gray-400 truncate mt-0.5">{c.descricao}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setModalConteudo({ aberto: true, conteudo: c })}
                          className="text-xs font-bold text-[#1b4326] bg-white hover:bg-[#f2fcf5] px-3 py-1.5 rounded-xl border border-gray-200 transition cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => removerConteudo(c.id)}
                          className="text-xs font-bold text-red-500 bg-white hover:bg-red-50 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-red-200 transition cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button type="button" onClick={onFechar} className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition cursor-pointer">Cancelar</button>
              <button type="submit" className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-[#1b4326] hover:bg-[#112e19] transition shadow-sm cursor-pointer">
                {aula ? "Salvar Alterações" : "✓ Criar Aula"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}


function ModalCurso({
  curso,
  onSalvar,
  onFechar,
}: {
  curso: Curso | null;
  onSalvar: (c: Curso) => void;
  onFechar: () => void;
}) {
  const [form, setForm] = useState<Curso>(
    curso ?? { id: gerarId(), titulo: "", categoria: CATEGORIAS[0], descricao: "", icone: "📚", nivel: NIVEIS[0], cargaHoraria: "", aulas: [] }
  );
  const [step, setStep] = useState<1 | 2>(1);
  const [modalAula, setModalAula] = useState<{ aberto: boolean; aula: Aula | null }>({ aberto: false, aula: null });
  const [salvando, setSalvando] = useState(false);

  const salvarAula = (a: Aula) => {
    setForm(f => ({
      ...f,
      aulas: f.aulas.some(x => x.id === a.id)
        ? f.aulas.map(x => x.id === a.id ? a : x)
        : [...f.aulas, a],
    }));
    setModalAula({ aberto: false, aula: null });
  };

  const removerAula = (id: string) => {
    if (!confirm("Remover esta aula e todos os seus materiais?")) return;
    setForm(f => ({ ...f, aulas: f.aulas.filter(a => a.id !== id) }));
  };

  const totalConteudos = form.aulas.reduce((acc, a) => acc + a.conteudos.length, 0);

  const handleFinalizar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.descricao.trim()) return;
    setSalvando(true);
    try {
      onSalvar(form);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      {modalAula.aberto && (
        <ModalAula
          aula={modalAula.aula}
          onSalvar={salvarAula}
          onFechar={() => setModalAula({ aberto: false, aula: null })}
        />
      )}

      <div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={e => { if (e.target === e.currentTarget) onFechar(); }}
      >
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[94vh] overflow-y-auto animate-fadeIn">
          <div className="bg-[#1b4326] px-8 py-6 flex items-start justify-between sticky top-0 rounded-t-3xl z-10">
            <div className="flex-1">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {curso ? "Editar Curso" : "Cadastrar Novo Curso"}
              </h2>
              <p className="text-white/60 text-sm mt-0.5">
                {form.titulo || "Preencha as informações da trilha"}
              </p>
              <div className="flex items-center gap-2 mt-4">
                {[{ n: 1, label: "Informações" }, { n: 2, label: "Aulas & Conteúdo" }].map(s => (
                  <button
                    key={s.n}
                    type="button"
                    onClick={() => { if (s.n === 2 && !form.titulo) return; setStep(s.n as 1 | 2); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold transition cursor-pointer ${step === s.n
                        ? "bg-[#88D66C] text-[#1b4326]"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${step === s.n ? "bg-[#1b4326] text-white" : "bg-white/20 text-white"
                      }`}>{s.n}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={onFechar} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer text-sm font-bold ml-4">✕</button>
          </div>

          <form onSubmit={handleFinalizar}>
            {step === 1 && (
              <div className="p-8 flex flex-col gap-6">
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-3">Ícone do Curso</label>
                  <div className="flex flex-wrap gap-2">
                    {ICONES.map(ic => (
                      <button
                        key={ic}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, icone: ic }))}
                        className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center transition border-2 cursor-pointer ${form.icone === ic ? "border-[#1b4326] bg-[#f2fcf5] scale-110 shadow-sm" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                          }`}
                      >
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Título do Curso <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Formalização do MEI: Passo a Passo"
                      value={form.titulo}
                      onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition placeholder:font-normal placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Categoria</label>
                    <select
                      value={form.categoria}
                      onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition cursor-pointer"
                    >
                      {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Nível</label>
                    <select
                      value={form.nivel}
                      onChange={e => setForm(f => ({ ...f, nivel: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition cursor-pointer"
                    >
                      {NIVEIS.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Descrição <span className="text-red-400">*</span></label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Descreva o objetivo do curso e o que o aluno vai aprender..."
                    value={form.descricao}
                    onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition resize-none placeholder:font-normal placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Carga Horária Total</label>
                  <input
                    type="text"
                    placeholder="Ex: 8h 30min"
                    value={form.cargaHoraria ?? ""}
                    onChange={e => setForm(f => ({ ...f, cargaHoraria: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition placeholder:font-normal placeholder:text-gray-400"
                  />
                </div>
                {form.titulo && (
                  <div className="bg-[#f2fcf5] border border-green-200 rounded-2xl p-5 flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">{form.icone}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1b4326] bg-white px-2 py-0.5 rounded-full border border-green-200">{form.categoria}</span>
                        {form.nivel && <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">{form.nivel}</span>}
                      </div>
                      <p className="text-sm font-bold text-[#1b4326] truncate">{form.titulo}</p>
                      {form.descricao && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{form.descricao}</p>}
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    disabled={!form.titulo || !form.descricao}
                    onClick={() => setStep(2)}
                    className="bg-[#1b4326] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-[#112e19] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Próximo: Configurar Aulas →
                  </button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="p-8 flex flex-col gap-6">
                <div className="grid grid-cols-3 gap-3">
                  <StatCard icone="🎓" label="Aulas" valor={form.aulas.length} cor="bg-[#f2fcf5] text-[#1b4326]" />
                  <StatCard icone="📦" label="Materiais" valor={totalConteudos} cor="bg-blue-50 text-blue-800" />
                  <StatCard icone="⏱️" label="Carga" valor={form.cargaHoraria || "—"} cor="bg-amber-50 text-amber-800" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[#1b4326] uppercase tracking-wider">Aulas da Trilha</h3>
                  <button
                    type="button"
                    onClick={() => setModalAula({ aberto: true, aula: null })}
                    className="flex items-center gap-2 bg-[#1b4326] hover:bg-[#112e19] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    + Nova Aula
                  </button>
                </div>
                {form.aulas.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center flex flex-col items-center">
                    <div className="text-4xl mb-3">🎓</div>
                    <p className="text-sm font-bold text-gray-600">Nenhuma aula criada ainda</p>
                    <p className="text-xs text-gray-400 mt-1 mb-5">Crie aulas e adicione materiais como vídeos, textos, PDFs e quizzes</p>
                    <button
                      type="button"
                      onClick={() => setModalAula({ aberto: true, aula: null })}
                      className="text-xs font-bold text-[#1b4326] bg-[#f2fcf5] hover:bg-green-100 px-5 py-2.5 rounded-xl border border-green-200 transition cursor-pointer"
                    >
                      + Criar Primeira Aula
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {form.aulas.map((aula, idx) => (
                      <div key={aula.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#88D66C]/60 hover:shadow-sm transition group">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-[#1b4326] text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-800 text-sm truncate">{aula.titulo}</h4>
                              {aula.descricao && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{aula.descricao}</p>}
                              <div className="flex items-center gap-3 mt-2 flex-wrap">
                                {aula.duracao && (
                                  <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">⏱ {aula.duracao}</span>
                                )}
                                {aula.conteudos.length > 0 && (
                                  <span className="text-[10px] font-bold text-[#1b4326] bg-[#f2fcf5] px-2 py-0.5 rounded-md border border-green-100">
                                    {aula.conteudos.length} {aula.conteudos.length === 1 ? "material" : "materiais"}
                                  </span>
                                )}
                                {[...new Set(aula.conteudos.map(c => c.tipo))].map(t => (
                                  <BadgeTipo key={t} tipo={t} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => setModalAula({ aberto: true, aula })}
                              className="text-xs font-bold text-[#1b4326] bg-[#f2fcf5] hover:bg-green-100 px-3 py-1.5 rounded-xl border border-green-200 transition cursor-pointer"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => removerAula(aula.id)}
                              className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl border border-red-100 transition cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition cursor-pointer"
                  >
                    ← Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={salvando}
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-[#1b4326] hover:bg-[#112e19] transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {salvando ? "Salvando..." : curso ? "✓ Salvar Alterações" : "✓ Publicar Curso"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState<"painel" | "cursos" | "configuracoes">("painel");
  const [cursoSelecionadoId, setCursoSelecionadoId] = useState<string | null>(null);
  const [modalCurso, setModalCurso] = useState<{ aberto: boolean; curso: Curso | null }>({ aberto: false, curso: null });
  const [confirmExcluir, setConfirmExcluir] = useState<string | null>(null);

  const [perfil, setPerfil] = useState<PerfilUsuario>({ nome: "", email: "", empresa: "", papel: "Empreendedor" });
  const [listaCursos, setListaCursos] = useState<Curso[]>([]);
  const [cursosInscritos, setCursosInscritos] = useState<string[]>([]);
  const [aulasConcluidas, setAulasConcluidas] = useState<string[]>([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        const usuario = await obterUsuarioLogado();
        if (!usuario) { router.push("/login"); return; }
        setPerfil({ nome: usuario.nome, email: usuario.email, empresa: usuario.empresa || "", papel: usuario.papel });
        const cursos = await listarCursos();
        setListaCursos(
          (cursos as any[]).map(curso => ({
            ...curso,
            aulas: (curso.aulas ?? []).map((aula: any) => ({ ...aula, conteudos: [] })),
          })) as Curso[]
        );
        const progresso = await obterProgressoUsuario();
        setCursosInscritos(progresso.cursosInscritos);
        setAulasConcluidas(progresso.aulasConcluidas);
      } catch (err) {
        console.error("Erro ao inicializar dashboard:", err);
      } finally {
        setCarregando(false);
      }
    }
    carregarDados();
  }, [router]);

  const handleAlternarInscricao = async (cursoId: string) => {
    try {
      const res = await alternarInscricao(cursoId);
      if (res.sucesso) {
        const progresso = await obterProgressoUsuario();
        setCursosInscritos(progresso.cursosInscritos);
        setAulasConcluidas(progresso.aulasConcluidas);
        if (!res.inscrito && cursoSelecionadoId === cursoId) setCursoSelecionadoId(null);
      } else if (res.erro) alert(res.erro);
    } catch (err) { console.error(err); }
  };

  const handleAlternarAulaConcluida = async (aulaId: string) => {
    try {
      const res = await alternarAulaConcluida(aulaId);
      if (res.sucesso) {
        const progresso = await obterProgressoUsuario();
        setAulasConcluidas(progresso.aulasConcluidas);
      } else if (res.erro) alert(res.erro);
    } catch (err) { console.error(err); }
  };

  const handleSalvarPerfil = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res = await atualizarPerfil(formData);
      if (res.sucesso) alert(res.mensagem || "Perfil atualizado com sucesso!");
      else if (res.erro) alert(res.erro);
    } catch (err) { console.error(err); alert("Erro ao atualizar o perfil."); }
  };

  const salvarCurso = (c: Curso) => {
    setListaCursos(prev =>
      prev.some(x => x.id === c.id) ? prev.map(x => x.id === c.id ? c : x) : [...prev, c]
    );
    setModalCurso({ aberto: false, curso: null });
  };

  const excluirCurso = (id: string) => {
    setListaCursos(prev => prev.filter(c => c.id !== id));
    if (cursoSelecionadoId === id) setCursoSelecionadoId(null);
    setConfirmExcluir(null);
  };

  const calcularProgressoCurso = (curso: Curso) => {
    const ids = curso.aulas.map(a => a.id);
    const concluidas = ids.filter(id => aulasConcluidas.includes(id));
    if (ids.length === 0) return 0;
    return Math.round((concluidas.length / ids.length) * 100);
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-[#f4f5f4] flex flex-col items-center justify-center font-sans antialiased text-[#1b4326]">
        <div className="relative w-20 h-20 mb-4 animate-bounce">
          <Image src={logoImage} alt="Logo" fill className="object-contain" />
        </div>
        <p className="text-lg font-extrabold tracking-tight">Carregando ambiente de estudos...</p>
        <div className="mt-4 w-40 bg-gray-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#88D66C] h-1.5 rounded-full animate-pulse w-full"></div>
        </div>
      </div>
    );
  }

  const totalAulasExistentes = listaCursos.reduce((acc, c) => acc + c.aulas.length, 0);
  const progressoGeralPlataforma = totalAulasExistentes > 0
    ? Math.round((aulasConcluidas.length / totalAulasExistentes) * 100) : 0;
  const cursoAtivoParaExibicao = listaCursos.find(c => c.id === cursoSelecionadoId);
  const cursosAtivos = listaCursos.filter(c => cursosInscritos.includes(c.id));
  const cursosSugeridos = listaCursos.filter(c => !cursosInscritos.includes(c.id));

  return (
    <main className="min-h-screen bg-[#f4f5f4] flex font-sans antialiased text-gray-800">
      {modalCurso.aberto && (
        <ModalCurso
          curso={modalCurso.curso}
          onSalvar={salvarCurso}
          onFechar={() => setModalCurso({ aberto: false, curso: null })}
        />
      )}
      {confirmExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center animate-fadeIn">
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="text-lg font-extrabold text-gray-800 mb-2">Excluir este curso?</h3>
            <p className="text-sm text-gray-500 mb-6">Todas as aulas e materiais serão removidos permanentemente. Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setConfirmExcluir(null)} className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition cursor-pointer">Cancelar</button>
              <button onClick={() => excluirCurso(confirmExcluir)} className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition cursor-pointer">Excluir</button>
            </div>
          </div>
        </div>
      )}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10 shadow-sm">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="relative w-10 h-10 -my-2">
            <Image src={logoImage} alt="Logo" fill className="object-contain" />
          </div>
          <span className="text-xl font-extrabold text-[#1b4326] tracking-tight">EnsinosTech</span>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1.5">
          {[
            { key: "painel", label: "Painel de Estudos", icon: "📊" },
            { key: "cursos", label: "Todos os Cursos", icon: "📚" },
            { key: "configuracoes", label: "Configurações", icon: "⚙️" },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => { setAbaAtiva(item.key as typeof abaAtiva); setCursoSelecionadoId(null); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition text-left w-full cursor-pointer ${abaAtiva === item.key && !cursoSelecionadoId
                  ? "bg-[#f2fcf5] text-[#1b4326]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#1b4326]"
                }`}
            >
              <span className="text-xl">{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-full bg-[#1b4326] flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
              {perfil.nome ? perfil.nome.substring(0, 2) : "US"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-[#1b4326] truncate">{perfil.nome}</span>
              <button onClick={async () => { await logout(); }} className="text-[10px] text-red-500 font-extrabold hover:underline text-left cursor-pointer">
                Sair da Plataforma
              </button>
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
              <div className="bg-white border border-gray-200 text-[#1b4326] px-4 py-2 rounded-xl text-xs font-bold shadow-sm hidden md:block">Ambiente Acadêmico</div>
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
                      <span className="bg-[#88D66C] text-[#1b4326] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Continue Aprendendo</span>
                      <h2 className="text-3xl font-bold mb-2 tracking-tight">{cursosAtivos[0].titulo}</h2>
                      <p className="text-white/80 text-sm mb-6 leading-relaxed">Retome seus estudos e finalize a próxima aula para dar mais um passo na formalização do seu negócio.</p>
                      <button onClick={() => setCursoSelecionadoId(cursosAtivos[0].id)} className="bg-white text-[#1b4326] px-8 py-3 rounded-xl text-sm font-bold hover:bg-gray-100 transition shadow cursor-pointer">Retomar Trilha →</button>
                    </div>
                    <div className="relative z-10 hidden md:flex text-8xl opacity-20">{cursosAtivos[0].icone}</div>
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-extrabold text-[#1b4326] tracking-tighter mb-4">Suas Trilhas Ativas</h2>
                  {cursosAtivos.length === 0 ? (
                    <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-10 text-center flex flex-col items-center">
                      <div className="text-5xl mb-4">👀</div>
                      <h3 className="text-lg font-bold text-[#1b4326] mb-2">Você ainda não está inscrito em nenhuma trilha</h3>
                      <p className="text-sm text-gray-500 mb-6 max-w-md">Para começar, escolha um curso no catálogo.</p>
                      <button onClick={() => setAbaAtiva("cursos")} className="bg-[#1b4326] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#112e19] transition shadow-sm cursor-pointer">Explorar Catálogo de Cursos</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {cursosAtivos.map(curso => {
                        const progresso = calcularProgressoCurso(curso);
                        return (
                          <div key={curso.id} onClick={() => setCursoSelecionadoId(curso.id)} className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#88D66C]/50 transition cursor-pointer group animate-fadeIn">
                            <div>
                              <div className="flex justify-between items-start mb-4">
                                <div className="text-4xl group-hover:scale-110 transition-transform">{curso.icone}</div>
                                <span className="text-[10px] font-black uppercase tracking-widest bg-[#f2fcf5] text-[#1b4326] px-2.5 py-1 rounded-full border border-green-100">{curso.categoria}</span>
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
                  <h3 className="text-sm font-extrabold text-[#1b4326] uppercase tracking-wider mb-4 flex items-center gap-2"><span>🔔</span> Mural de Avisos</h3>
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
                  <button className="w-full text-center mt-5 text-xs font-bold text-[#1b4326] bg-gray-50 py-2 rounded-xl hover:bg-gray-100 transition cursor-pointer">Ver todos os avisos</button>
                </div>
                {cursosSugeridos.length > 0 && (
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-sm font-extrabold text-[#1b4326] uppercase tracking-wider mb-4 flex items-center gap-2"><span>💡</span> Sugeridos para Você</h3>
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
                    <button onClick={() => setAbaAtiva("cursos")} className="w-full text-center mt-4 text-xs font-bold text-white bg-[#1b4326] py-2.5 rounded-xl hover:bg-[#112e19] transition shadow-sm cursor-pointer">Explorar Mais Trilhas</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {cursoSelecionadoId && cursoAtivoParaExibicao && (
          <div className="max-w-[1200px] mx-auto animate-fadeIn">
            <button onClick={() => setCursoSelecionadoId(null)} className="mb-6 text-sm font-bold text-[#1b4326] hover:bg-white hover:shadow-sm px-4 py-2 rounded-xl border border-transparent hover:border-gray-200 transition flex items-center gap-2 cursor-pointer">
              ← Voltar para o Painel Geral
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-fit relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#88D66C]"></div>
                <div className="text-6xl mb-6">{cursoAtivoParaExibicao.icone}</div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#1b4326] bg-[#f2fcf5] px-3 py-1 rounded-full border border-green-100">{cursoAtivoParaExibicao.categoria}</span>
                  {cursoAtivoParaExibicao.nivel && <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{cursoAtivoParaExibicao.nivel}</span>}
                </div>
                <h2 className="text-2xl font-extrabold text-[#1b4326] tracking-tight mt-3 mb-3">{cursoAtivoParaExibicao.titulo}</h2>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-4">{cursoAtivoParaExibicao.descricao}</p>
                {cursoAtivoParaExibicao.cargaHoraria && (
                  <p className="text-xs text-gray-400 font-bold mb-6">⏱ Carga horária: {cursoAtivoParaExibicao.cargaHoraria}</p>
                )}
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex justify-between items-center text-sm font-bold text-gray-600 mb-3">
                    <span>Progresso da Trilha</span>
                    <span className="text-[#1b4326] font-black">{calcularProgressoCurso(cursoAtivoParaExibicao)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-[#1b4326] h-3 rounded-full transition-all duration-500" style={{ width: `${calcularProgressoCurso(cursoAtivoParaExibicao)}%` }}></div>
                  </div>
                </div>
                <button onClick={() => handleAlternarInscricao(cursoAtivoParaExibicao.id)} className="w-full mt-8 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 py-3 rounded-xl transition cursor-pointer">
                  Cancelar Inscrição neste Curso
                </button>
              </div>
              <div className="lg:col-span-2 flex flex-col gap-4">
                <h3 className="text-2xl font-extrabold text-[#1b4326] tracking-tighter mb-2">Cronograma de Aulas</h3>
                {cursoAtivoParaExibicao.aulas.length === 0 && (
                  <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-10 text-center">
                    <div className="text-4xl mb-3">🚧</div>
                    <p className="font-bold text-gray-600">Este curso ainda não tem aulas publicadas.</p>
                    <p className="text-sm text-gray-400 mt-1">Volte em breve!</p>
                  </div>
                )}
                {cursoAtivoParaExibicao.aulas.map((aula, index) => {
                  const concluida = aulasConcluidas.includes(aula.id);
                  const totalMateriais = aula.conteudos.length;
                  return (
                    <div key={aula.id} className={`p-5 md:p-6 rounded-3xl border transition animate-fadeIn ${concluida ? "bg-[#f2fcf5] border-green-200 shadow-sm" : "bg-white border-gray-100 shadow-sm hover:border-gray-300"}`}>
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div className="flex items-start gap-5">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm flex-shrink-0 ${concluida ? "bg-[#1b4326] text-white" : "bg-gray-50 text-gray-400 border border-gray-200"}`}>
                            {concluida ? "✓" : index + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-base">{aula.titulo}</h4>
                            {aula.descricao && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{aula.descricao}</p>}
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              {aula.duracao && <span className="text-xs text-gray-500 font-bold flex items-center gap-1">⏱️ {aula.duracao}</span>}
                              {totalMateriais > 0 && <span className="text-[10px] font-bold text-[#1b4326] bg-[#f2fcf5] px-2 py-0.5 rounded-md border border-green-100">{totalMateriais} {totalMateriais === 1 ? "material" : "materiais"}</span>}
                              {[...new Set(aula.conteudos.map(c => c.tipo))].map(t => <BadgeTipo key={t} tipo={t} />)}
                            </div>
                          </div>
                        </div>
                        <button onClick={() => handleAlternarAulaConcluida(aula.id)} className={`px-6 py-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 w-full md:w-auto shadow-sm cursor-pointer flex-shrink-0 ${concluida ? "bg-[#1b4326] text-white hover:bg-[#112e19]" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                          {concluida ? "✓ Finalizada" : "Marcar como Feita"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {abaAtiva === "cursos" && (
          <div className="max-w-[1400px] mx-auto animate-fadeIn">
            <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-[#1b4326] tracking-tighter">Catálogo de Trilhas</h1>
                <p className="text-sm text-gray-500 font-semibold mt-0.5">
                  {listaCursos.length} {listaCursos.length === 1 ? "curso disponível" : "cursos disponíveis"} · Explore e inscreva-se para começar
                </p>
              </div>
              <button
                onClick={() => setModalCurso({ aberto: true, curso: null })}
                className="flex items-center gap-2.5 bg-[#1b4326] hover:bg-[#112e19] text-white px-5 py-3 rounded-2xl text-sm font-bold transition shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                <span className="text-base leading-none">＋</span>
                Cadastrar Novo Curso
              </button>
            </header>

            {listaCursos.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-16 text-center flex flex-col items-center">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-lg font-bold text-[#1b4326] mb-2">Nenhum curso cadastrado ainda</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-md">Clique em "Cadastrar Novo Curso" para adicionar a primeira trilha à plataforma.</p>
                <button onClick={() => setModalCurso({ aberto: true, curso: null })} className="bg-[#1b4326] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#112e19] transition shadow-sm cursor-pointer">
                  ＋ Cadastrar Primeiro Curso
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listaCursos.map(curso => {
                  const inscrito = cursosInscritos.includes(curso.id);
                  const totalMateriais = curso.aulas.reduce((acc, a) => acc + a.conteudos.length, 0);
                  return (
                    <div key={curso.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition animate-fadeIn">
                      <div>
                        <div className="flex justify-between items-start mb-5">
                          <div className="text-5xl">{curso.icone}</div>
                          <div className="flex flex-col items-end gap-1.5">
                            {inscrito && <span className="bg-[#1b4326] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">Ativo</span>}
                            {curso.nivel && <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{curso.nivel}</span>}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight">{curso.titulo}</h3>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed mb-4">{curso.descricao}</p>
                      </div>

                      <div className="mt-2 pt-5 border-t border-gray-50">
                        <div className="flex justify-between items-center text-xs font-bold text-gray-400 mb-1.5">
                          <span>{curso.aulas.length} {curso.aulas.length === 1 ? "Aula" : "Aulas"}</span>
                          <span>{totalMateriais} {totalMateriais === 1 ? "Material" : "Materiais"}</span>
                          <span className="bg-gray-50 px-2 py-1 rounded-md text-gray-600">Gratuito</span>
                        </div>
                        {curso.cargaHoraria && (
                          <p className="text-[10px] font-bold text-gray-400 mb-3">⏱ {curso.cargaHoraria}</p>
                        )}
                        <div className="flex gap-2 mb-2">
                          <button
                            onClick={() => handleAlternarInscricao(curso.id)}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition shadow-sm border cursor-pointer ${inscrito ? "bg-white text-red-500 border-red-100 hover:bg-red-50" : "bg-[#1b4326] text-white border-transparent hover:bg-[#112e19]"
                              }`}
                          >
                            {inscrito ? "Cancelar Inscrição" : "Inscrever-se"}
                          </button>
                          {inscrito && (
                            <button onClick={() => { setAbaAtiva("painel"); setCursoSelecionadoId(curso.id); }} className="flex-1 bg-[#88D66C] text-[#1b4326] py-2.5 rounded-xl text-xs font-extrabold hover:bg-[#7bc260] transition shadow-sm border border-transparent cursor-pointer">
                              Acessar Aulas
                            </button>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setModalCurso({ aberto: true, curso })}
                            className="flex-1 py-2 rounded-xl text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition cursor-pointer"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => setConfirmExcluir(curso.id)}
                            className="flex-1 py-2 rounded-xl text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 transition cursor-pointer"
                          >
                            🗑️ Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
              <form onSubmit={handleSalvarPerfil} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Nome Completo</label>
                    <input type="text" name="nome" value={perfil.nome} onChange={e => setPerfil({ ...perfil, nome: e.target.value })} required className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:bg-white focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">E-mail de Acesso</label>
                    <input type="email" name="email" value={perfil.email} onChange={e => setPerfil({ ...perfil, email: e.target.value })} required className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:bg-white focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Nome do Seu Negócio</label>
                  <input type="text" name="empresa" value={perfil.empresa} onChange={e => setPerfil({ ...perfil, empresa: e.target.value })} className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:bg-white focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition" />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Permissão de Sistema</label>
                  <input type="text" disabled value={perfil.papel} className="w-full px-5 py-3.5 rounded-xl bg-gray-100 border border-gray-200 text-sm font-bold text-gray-400 cursor-not-allowed" />
                </div>
                <div className="border-t border-gray-100 pt-6 mt-2 flex justify-end">
                  <button type="submit" className="bg-[#1b4326] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-[#112e19] transition shadow-md cursor-pointer">Salvar Modificações</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}