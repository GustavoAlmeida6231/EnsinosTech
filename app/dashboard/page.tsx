"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoImage from "../../public/logo.png";
import { obterUsuarioLogado, logout, atualizarPerfil } from "../../action/auth";

// ─── Tipos ────────────────────────────────────────────────────────────────────

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

// ─── Chaves do localStorage ───────────────────────────────────────────────────

const LS_CURSOS       = "ensinostech:cursos";
const LS_INSCRITOS    = "ensinostech:inscritos";
const LS_CONCLUIDAS   = "ensinostech:concluidas";

function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
function lsSet(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* noop */ }
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const ICONES = ["📚","💼","📊","🧾","💡","🏦","📱","🤝","🎯","⚖️","🛒","📣","🧠","🔧","📐","🌱","🏅","🗂️","💻","📝"];
const CATEGORIAS = ["Gestão","Financeiro","Marketing","Jurídico","Tecnologia","Vendas","Empreendedorismo","Contabilidade","Recursos Humanos"];
const NIVEIS = ["Iniciante","Intermediário","Avançado"];
const TIPOS_CONTEUDO: { valor: TipoConteudo; label: string; icone: string; cor: string }[] = [
  { valor: "video", label: "Vídeo",         icone: "🎬", cor: "bg-blue-50 text-blue-700 border-blue-200"     },
  { valor: "texto", label: "Texto",         icone: "📝", cor: "bg-amber-50 text-amber-700 border-amber-200"  },
  { valor: "pdf",   label: "PDF",           icone: "📄", cor: "bg-red-50 text-red-700 border-red-200"        },
  { valor: "quiz",  label: "Quiz",          icone: "🧩", cor: "bg-purple-50 text-purple-700 border-purple-200"},
  { valor: "link",  label: "Link Externo",  icone: "🔗", cor: "bg-green-50 text-green-700 border-green-200"  },
];

function gerarId() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Componentes auxiliares ───────────────────────────────────────────────────

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

// ─── Modal de Questão ─────────────────────────────────────────────────────────

function ModalQuestao({ questao, onChange, onRemover, index }: {
  questao: Questao; onChange: (q: Questao) => void; onRemover: () => void; index: number;
}) {
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-purple-700 uppercase tracking-wider">Questão {index + 1}</span>
        <button type="button" onClick={onRemover} className="text-red-400 hover:text-red-600 text-xs font-bold cursor-pointer">✕ Remover</button>
      </div>
      <input
        type="text" placeholder="Pergunta..." value={questao.pergunta}
        onChange={e => onChange({ ...questao, pergunta: e.target.value })}
        className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 text-sm font-medium text-gray-800 focus:outline-none focus:border-purple-400 transition"
      />
      <div className="grid grid-cols-2 gap-2">
        {questao.opcoes.map((op, i) => (
          <div key={i} className="flex items-center gap-2">
            <button type="button" onClick={() => onChange({ ...questao, respostaCorreta: i })}
              className={`w-5 h-5 rounded-full border-2 flex-shrink-0 cursor-pointer transition ${questao.respostaCorreta === i ? "bg-purple-600 border-purple-600" : "border-gray-300 bg-white hover:border-purple-400"}`}
              title="Marcar como correta" />
            <input type="text" placeholder={`Opção ${i + 1}`} value={op}
              onChange={e => { const n = [...questao.opcoes]; n[i] = e.target.value; onChange({ ...questao, opcoes: n }); }}
              className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-purple-200 text-xs font-medium text-gray-700 focus:outline-none focus:border-purple-400 transition"
            />
          </div>
        ))}
      </div>
      <p className="text-[10px] text-purple-600 font-bold">● Clique no círculo para marcar a resposta correta</p>
    </div>
  );
}

// ─── Modal de Conteúdo ────────────────────────────────────────────────────────

function ModalConteudo({ conteudo, onSalvar, onFechar }: {
  conteudo: Conteudo | null; onSalvar: (c: Conteudo) => void; onFechar: () => void;
}) {
  const [form, setForm] = useState<Conteudo>(
    conteudo ?? { id: gerarId(), tipo: "video", titulo: "", descricao: "", url: "", duracao: "", questoes: [] }
  );

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim()) return;
    onSalvar(form);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onFechar(); }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="bg-[#1b4326] px-7 py-5 flex items-center justify-between sticky top-0 rounded-t-3xl z-10">
          <div>
            <h2 className="text-lg font-extrabold text-white">{conteudo ? "Editar Material" : "Adicionar Material"}</h2>
            <p className="text-white/60 text-xs mt-0.5">Configure o conteúdo desta aula</p>
          </div>
          <button onClick={onFechar} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm font-bold cursor-pointer transition">✕</button>
        </div>
        <form onSubmit={handleSalvar} className="p-7 flex flex-col gap-5">
          {/* Tipo */}
          <div>
            <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Tipo de Material</label>
            <div className="flex flex-wrap gap-2">
              {TIPOS_CONTEUDO.map(t => (
                <button key={t.valor} type="button" onClick={() => setForm(f => ({ ...f, tipo: t.valor }))}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border-2 transition cursor-pointer ${form.tipo === t.valor ? `${t.cor} border-current scale-105 shadow-sm` : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"}`}>
                  {t.icone} {t.label}
                </button>
              ))}
            </div>
          </div>
          {/* Título */}
          <div>
            <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Título <span className="text-red-400">*</span></label>
            <input type="text" required placeholder="Ex: Introdução ao Fluxo de Caixa" value={form.titulo}
              onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition placeholder:font-normal placeholder:text-gray-400" />
          </div>
          {/* Descrição */}
          <div>
            <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Descrição</label>
            <textarea rows={2} placeholder="Breve descrição do conteúdo..." value={form.descricao ?? ""}
              onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition resize-none placeholder:font-normal placeholder:text-gray-400" />
          </div>
          {/* URL */}
          {(form.tipo === "video" || form.tipo === "link" || form.tipo === "pdf") && (
            <div>
              <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                {form.tipo === "video" ? "URL do Vídeo" : form.tipo === "pdf" ? "URL do PDF" : "URL do Link"}
              </label>
              <input type="url" placeholder="https://..." value={form.url ?? ""}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition placeholder:font-normal placeholder:text-gray-400" />
            </div>
          )}
          {form.tipo === "video" && (
            <div>
              <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Duração</label>
              <input type="text" placeholder="Ex: 12 min" value={form.duracao ?? ""}
                onChange={e => setForm(f => ({ ...f, duracao: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition placeholder:font-normal placeholder:text-gray-400" />
            </div>
          )}
          {form.tipo === "texto" && (
            <div>
              <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Conteúdo do Texto</label>
              <textarea rows={6} placeholder="Escreva o conteúdo textual aqui..." value={form.texto ?? ""}
                onChange={e => setForm(f => ({ ...f, texto: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition resize-none placeholder:font-normal placeholder:text-gray-400" />
            </div>
          )}
          {form.tipo === "quiz" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Questões</label>
                <button type="button"
                  onClick={() => setForm(f => ({ ...f, questoes: [...(f.questoes ?? []), { id: gerarId(), pergunta: "", opcoes: ["","","",""], respostaCorreta: 0 }] }))}
                  className="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 transition cursor-pointer">
                  + Adicionar Questão
                </button>
              </div>
              {(form.questoes ?? []).length === 0 && (
                <div className="bg-purple-50 border border-dashed border-purple-200 rounded-2xl p-6 text-center text-xs text-purple-600 font-bold">
                  🧩 Nenhuma questão ainda. Clique em "Adicionar Questão".
                </div>
              )}
              {(form.questoes ?? []).map((q, i) => (
                <ModalQuestao key={q.id} questao={q} index={i}
                  onChange={nq => setForm(f => ({ ...f, questoes: (f.questoes ?? []).map(x => x.id === nq.id ? nq : x) }))}
                  onRemover={() => setForm(f => ({ ...f, questoes: (f.questoes ?? []).filter(x => x.id !== q.id) }))} />
              ))}
            </div>
          )}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onFechar} className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition cursor-pointer">Cancelar</button>
            <button type="submit" className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-[#1b4326] hover:bg-[#112e19] transition shadow-sm cursor-pointer">
              {conteudo ? "Salvar Alterações" : "✓ Adicionar Material"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Modal de Aula ────────────────────────────────────────────────────────────

function ModalAula({ aula, onSalvar, onFechar }: {
  aula: Aula | null; onSalvar: (a: Aula) => void; onFechar: () => void;
}) {
  const [form, setForm] = useState<Aula>(
    aula ?? { id: gerarId(), titulo: "", duracao: "", descricao: "", conteudos: [] }
  );
  const [modalConteudo, setModalConteudo] = useState<{ aberto: boolean; conteudo: Conteudo | null }>({ aberto: false, conteudo: null });

  const salvarConteudo = (c: Conteudo) => {
    setForm(f => ({
      ...f,
      conteudos: f.conteudos.some(x => x.id === c.id)
        ? f.conteudos.map(x => x.id === c.id ? c : x)
        : [...f.conteudos, c],
    }));
    setModalConteudo({ aberto: false, conteudo: null });
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim()) return;
    onSalvar(form);
  };

  return (
    <>
      {modalConteudo.aberto && (
        <ModalConteudo conteudo={modalConteudo.conteudo} onSalvar={salvarConteudo}
          onFechar={() => setModalConteudo({ aberto: false, conteudo: null })} />
      )}
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={e => { if (e.target === e.currentTarget) onFechar(); }}>
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
          <div className="bg-[#1b4326] px-7 py-5 flex items-center justify-between sticky top-0 rounded-t-3xl z-10">
            <div>
              <h2 className="text-lg font-extrabold text-white">{aula ? "Editar Aula" : "Nova Aula"}</h2>
              <p className="text-white/60 text-xs mt-0.5">Configure título, duração e materiais</p>
            </div>
            <button onClick={onFechar} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm font-bold cursor-pointer transition">✕</button>
          </div>
          <form onSubmit={handleSalvar} className="p-7 flex flex-col gap-6">
            {/* Dados */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-extrabold text-[#1b4326] uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 bg-[#1b4326] text-white rounded-full flex items-center justify-center text-[10px] font-black">1</span>
                Dados da Aula
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Título <span className="text-red-400">*</span></label>
                  <input type="text" required placeholder="Ex: O que é o Simples Nacional?" value={form.titulo}
                    onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition placeholder:font-normal placeholder:text-gray-400" />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Duração</label>
                  <input type="text" placeholder="Ex: 45 min" value={form.duracao}
                    onChange={e => setForm(f => ({ ...f, duracao: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition placeholder:font-normal placeholder:text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Descrição da Aula</label>
                <textarea rows={2} placeholder="O que o aluno vai aprender nesta aula..." value={form.descricao ?? ""}
                  onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition resize-none placeholder:font-normal placeholder:text-gray-400" />
              </div>
            </div>
            {/* Materiais */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-[#1b4326] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#1b4326] text-white rounded-full flex items-center justify-center text-[10px] font-black">2</span>
                  Materiais
                </h3>
                <button type="button" onClick={() => setModalConteudo({ aberto: true, conteudo: null })}
                  className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#1b4326] hover:bg-[#112e19] px-3 py-2 rounded-xl transition cursor-pointer shadow-sm">
                  + Adicionar Material
                </button>
              </div>
              {form.conteudos.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
                  <div className="text-3xl mb-2">📦</div>
                  <p className="text-sm font-bold text-gray-500">Nenhum material ainda</p>
                  <p className="text-xs text-gray-400 mt-1">Adicione vídeos, textos, PDFs, quizzes ou links</p>
                  <button type="button" onClick={() => setModalConteudo({ aberto: true, conteudo: null })}
                    className="mt-4 text-xs font-bold text-[#1b4326] bg-[#f2fcf5] hover:bg-green-100 px-4 py-2 rounded-xl border border-green-200 transition cursor-pointer">
                    + Adicionar Primeiro Material
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {form.conteudos.map((c, idx) => (
                    <div key={c.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-between gap-3 hover:border-gray-300 transition">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-gray-400 text-xs font-bold w-5 text-center">{idx + 1}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <BadgeTipo tipo={c.tipo} />
                            {c.duracao && <span className="text-[10px] text-gray-400 font-bold">⏱ {c.duracao}</span>}
                          </div>
                          <p className="text-sm font-bold text-gray-800 mt-1 truncate">{c.titulo}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button type="button" onClick={() => setModalConteudo({ aberto: true, conteudo: c })}
                          className="text-xs font-bold text-[#1b4326] bg-white hover:bg-[#f2fcf5] px-3 py-1.5 rounded-xl border border-gray-200 transition cursor-pointer">Editar</button>
                        <button type="button" onClick={() => setForm(f => ({ ...f, conteudos: f.conteudos.filter(x => x.id !== c.id) }))}
                          className="text-xs font-bold text-red-500 bg-white hover:bg-red-50 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-red-200 transition cursor-pointer">✕</button>
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

// ─── Modal de Curso ───────────────────────────────────────────────────────────

function ModalCurso({ curso, onSalvar, onFechar }: {
  curso: Curso | null; onSalvar: (c: Curso) => void; onFechar: () => void;
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
      aulas: f.aulas.some(x => x.id === a.id) ? f.aulas.map(x => x.id === a.id ? a : x) : [...f.aulas, a],
    }));
    setModalAula({ aberto: false, aula: null });
  };

  const removerAula = (id: string) => {
    if (!confirm("Remover esta aula e todos os seus materiais?")) return;
    setForm(f => ({ ...f, aulas: f.aulas.filter(a => a.id !== id) }));
  };

  const totalMateriais = form.aulas.reduce((acc, a) => acc + a.conteudos.length, 0);

  const handleFinalizar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.descricao.trim()) return;
    setSalvando(true);
    // Pequeno delay visual de "salvando"
    setTimeout(() => {
      onSalvar(form);
      setSalvando(false);
    }, 300);
  };

  return (
    <>
      {modalAula.aberto && (
        <ModalAula aula={modalAula.aula} onSalvar={salvarAula}
          onFechar={() => setModalAula({ aberto: false, aula: null })} />
      )}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={e => { if (e.target === e.currentTarget) onFechar(); }}>
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[94vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-[#1b4326] px-8 py-6 flex items-start justify-between sticky top-0 rounded-t-3xl z-10">
            <div className="flex-1">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {curso ? "Editar Curso" : "Cadastrar Novo Curso"}
              </h2>
              <p className="text-white/60 text-sm mt-0.5 truncate max-w-xs">{form.titulo || "Preencha as informações da trilha"}</p>
              {/* Steps */}
              <div className="flex items-center gap-2 mt-4">
                {[{ n: 1, label: "Informações" }, { n: 2, label: "Aulas & Materiais" }].map(s => (
                  <button key={s.n} type="button"
                    onClick={() => { if (s.n === 2 && (!form.titulo || !form.descricao)) return; setStep(s.n as 1 | 2); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold transition cursor-pointer ${step === s.n ? "bg-[#88D66C] text-[#1b4326]" : "bg-white/10 text-white/70 hover:bg-white/20"}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${step === s.n ? "bg-[#1b4326] text-white" : "bg-white/20 text-white"}`}>{s.n}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={onFechar} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm font-bold cursor-pointer transition ml-4">✕</button>
          </div>

          <form onSubmit={handleFinalizar}>
            {/* ── Step 1 ── */}
            {step === 1 && (
              <div className="p-8 flex flex-col gap-6">
                {/* Ícone */}
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-3">Ícone do Curso</label>
                  <div className="flex flex-wrap gap-2">
                    {ICONES.map(ic => (
                      <button key={ic} type="button" onClick={() => setForm(f => ({ ...f, icone: ic }))}
                        className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center transition border-2 cursor-pointer ${form.icone === ic ? "border-[#1b4326] bg-[#f2fcf5] scale-110 shadow-sm" : "border-gray-200 bg-gray-50 hover:border-gray-300"}`}>
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Título */}
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Título do Curso <span className="text-red-400">*</span></label>
                  <input type="text" required placeholder="Ex: Formalização do MEI: Passo a Passo" value={form.titulo}
                    onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition placeholder:font-normal placeholder:text-gray-400" />
                </div>
                {/* Categoria + Nível */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Categoria</label>
                    <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition cursor-pointer">
                      {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Nível</label>
                    <select value={form.nivel} onChange={e => setForm(f => ({ ...f, nivel: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition cursor-pointer">
                      {NIVEIS.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                {/* Descrição */}
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Descrição <span className="text-red-400">*</span></label>
                  <textarea required rows={3} placeholder="Descreva o objetivo do curso e o que o aluno vai aprender..." value={form.descricao}
                    onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition resize-none placeholder:font-normal placeholder:text-gray-400" />
                </div>
                {/* Carga horária */}
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Carga Horária Total</label>
                  <input type="text" placeholder="Ex: 8h 30min" value={form.cargaHoraria ?? ""}
                    onChange={e => setForm(f => ({ ...f, cargaHoraria: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition placeholder:font-normal placeholder:text-gray-400" />
                </div>
                {/* Preview */}
                {form.titulo && (
                  <div className="bg-[#f2fcf5] border border-green-200 rounded-2xl p-5 flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">{form.icone}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1b4326] bg-white px-2 py-0.5 rounded-full border border-green-200">{form.categoria}</span>
                        {form.nivel && <span className="text-[10px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">{form.nivel}</span>}
                      </div>
                      <p className="text-sm font-bold text-[#1b4326] truncate">{form.titulo}</p>
                      {form.descricao && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{form.descricao}</p>}
                    </div>
                  </div>
                )}
                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <button type="button" disabled={!form.titulo || !form.descricao} onClick={() => setStep(2)}
                    className="bg-[#1b4326] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-[#112e19] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                    Próximo: Configurar Aulas →
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 2 ── */}
            {step === 2 && (
              <div className="p-8 flex flex-col gap-6">
                <div className="grid grid-cols-3 gap-3">
                  <StatCard icone="🎓" label="Aulas" valor={form.aulas.length} cor="bg-[#f2fcf5] text-[#1b4326]" />
                  <StatCard icone="📦" label="Materiais" valor={totalMateriais} cor="bg-blue-50 text-blue-800" />
                  <StatCard icone="⏱️" label="Carga" valor={form.cargaHoraria || "—"} cor="bg-amber-50 text-amber-800" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[#1b4326] uppercase tracking-wider">Aulas da Trilha</h3>
                  <button type="button" onClick={() => setModalAula({ aberto: true, aula: null })}
                    className="flex items-center gap-2 bg-[#1b4326] hover:bg-[#112e19] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer">
                    + Nova Aula
                  </button>
                </div>
                {form.aulas.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center flex flex-col items-center">
                    <div className="text-4xl mb-3">🎓</div>
                    <p className="text-sm font-bold text-gray-600">Nenhuma aula criada ainda</p>
                    <p className="text-xs text-gray-400 mt-1 mb-5">Você pode publicar o curso agora e adicionar aulas depois</p>
                    <button type="button" onClick={() => setModalAula({ aberto: true, aula: null })}
                      className="text-xs font-bold text-[#1b4326] bg-[#f2fcf5] hover:bg-green-100 px-5 py-2.5 rounded-xl border border-green-200 transition cursor-pointer">
                      + Criar Primeira Aula
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {form.aulas.map((aula, idx) => (
                      <div key={aula.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#88D66C]/60 hover:shadow-sm transition">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-[#1b4326] text-white flex items-center justify-center font-black text-sm flex-shrink-0">{idx + 1}</div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-800 text-sm truncate">{aula.titulo}</h4>
                              {aula.descricao && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{aula.descricao}</p>}
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                {aula.duracao && <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">⏱ {aula.duracao}</span>}
                                {aula.conteudos.length > 0 && (
                                  <span className="text-[10px] font-bold text-[#1b4326] bg-[#f2fcf5] px-2 py-0.5 rounded-md border border-green-100">
                                    {aula.conteudos.length} {aula.conteudos.length === 1 ? "material" : "materiais"}
                                  </span>
                                )}
                                {[...new Set(aula.conteudos.map(c => c.tipo))].map(t => <BadgeTipo key={t} tipo={t} />)}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button type="button" onClick={() => setModalAula({ aberto: true, aula })}
                              className="text-xs font-bold text-[#1b4326] bg-[#f2fcf5] hover:bg-green-100 px-3 py-1.5 rounded-xl border border-green-200 transition cursor-pointer">Editar</button>
                            <button type="button" onClick={() => removerAula(aula.id)}
                              className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl border border-red-100 transition cursor-pointer">✕</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 pt-2 border-t border-gray-100">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition cursor-pointer">← Voltar</button>
                  <button type="submit" disabled={salvando}
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-[#1b4326] hover:bg-[#112e19] transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
                    {salvando ? "Salvando…" : curso ? "✓ Salvar Alterações" : "✓ Publicar Curso"}
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

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ mensagem, visivel }: { mensagem: string; visivel: boolean }) {
  return (
    <div className={`fixed bottom-6 right-6 z-[80] transition-all duration-300 ${visivel ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
      <div className="bg-[#1b4326] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2">
        <span>✓</span> {mensagem}
      </div>
    </div>
  );
}

// ─── AulaCard (visão do aluno, materiais expandíveis e clicáveis) ─────────────

function MaterialItem({ conteudo }: { conteudo: Conteudo }) {
  const cfg = TIPOS_CONTEUDO.find(t => t.valor === conteudo.tipo)!;
  const temLink = (conteudo.tipo === "video" || conteudo.tipo === "pdf" || conteudo.tipo === "link") && conteudo.url;
  const [quizAberto, setQuizAberto] = useState(false);
  const [respostas, setRespostas]   = useState<Record<string, number>>({});
  const [enviado, setEnviado]       = useState(false);

  const acertosQuiz = enviado && conteudo.questoes
    ? conteudo.questoes.filter(q => respostas[q.id] === q.respostaCorreta).length
    : 0;

  return (
    <div className={`rounded-2xl border overflow-hidden ${cfg.cor.split(" ")[0]} border-opacity-60`}
      style={{ borderColor: "inherit" }}>
      <div className={`px-4 py-3 flex items-center justify-between gap-3 border ${cfg.cor}`}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base flex-shrink-0">{cfg.icone}</span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-800 truncate">{conteudo.titulo}</p>
            {conteudo.descricao && <p className="text-[10px] text-gray-500 truncate mt-0.5">{conteudo.descricao}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {conteudo.duracao && <span className="text-[10px] font-bold text-gray-500 hidden sm:block">⏱ {conteudo.duracao}</span>}
          {/* Botão de ação dependendo do tipo */}
          {temLink && (
            <a href={conteudo.url!} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-extrabold text-white bg-[#1b4326] hover:bg-[#112e19] px-3 py-1.5 rounded-xl transition shadow-sm cursor-pointer">
              {conteudo.tipo === "video" ? "▶ Assistir" : conteudo.tipo === "pdf" ? "📄 Abrir PDF" : "🔗 Acessar"}
            </a>
          )}
          {conteudo.tipo === "texto" && conteudo.texto && (
            <button onClick={() => setQuizAberto(o => !o)}
              className="flex items-center gap-1.5 text-xs font-extrabold text-white bg-[#1b4326] hover:bg-[#112e19] px-3 py-1.5 rounded-xl transition shadow-sm cursor-pointer">
              {quizAberto ? "Fechar" : "📖 Ler"}
            </button>
          )}
          {conteudo.tipo === "quiz" && conteudo.questoes && conteudo.questoes.length > 0 && (
            <button onClick={() => { setQuizAberto(o => !o); setEnviado(false); setRespostas({}); }}
              className="flex items-center gap-1.5 text-xs font-extrabold text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-xl transition shadow-sm cursor-pointer">
              {quizAberto ? "Fechar" : "🧩 Fazer Quiz"}
            </button>
          )}
        </div>
      </div>

      {/* Conteúdo expandido — texto */}
      {conteudo.tipo === "texto" && quizAberto && conteudo.texto && (
        <div className="px-5 py-4 bg-white border-t border-amber-100">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{conteudo.texto}</p>
        </div>
      )}

      {/* Conteúdo expandido — quiz */}
      {conteudo.tipo === "quiz" && quizAberto && conteudo.questoes && (
        <div className="px-5 py-4 bg-white border-t border-purple-100 flex flex-col gap-5">
          {conteudo.questoes.map((q, qi) => (
            <div key={q.id}>
              <p className="text-sm font-bold text-gray-800 mb-3">{qi + 1}. {q.pergunta}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.opcoes.map((op, oi) => {
                  const selecionada   = respostas[q.id] === oi;
                  const correta       = enviado && oi === q.respostaCorreta;
                  const errada        = enviado && selecionada && oi !== q.respostaCorreta;
                  return (
                    <button key={oi} disabled={enviado}
                      onClick={() => setRespostas(r => ({ ...r, [q.id]: oi }))}
                      className={`text-left px-4 py-2.5 rounded-xl text-xs font-semibold border-2 transition cursor-pointer disabled:cursor-default ${
                        correta  ? "bg-green-50 border-green-500 text-green-800" :
                        errada   ? "bg-red-50 border-red-400 text-red-700" :
                        selecionada ? "bg-purple-50 border-purple-500 text-purple-800" :
                        "bg-gray-50 border-gray-200 text-gray-700 hover:border-purple-300"
                      }`}>
                      {correta ? "✓ " : errada ? "✗ " : ""}{op}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {!enviado ? (
            <button
              onClick={() => setEnviado(true)}
              disabled={Object.keys(respostas).length < (conteudo.questoes?.length ?? 0)}
              className="self-start px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-purple-600 hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              Enviar Respostas
            </button>
          ) : (
            <div className={`rounded-2xl px-4 py-3 text-sm font-extrabold flex items-center gap-2 ${acertosQuiz === conteudo.questoes!.length ? "bg-green-50 text-green-800 border border-green-200" : "bg-amber-50 text-amber-800 border border-amber-200"}`}>
              {acertosQuiz === conteudo.questoes!.length ? "🏆" : "📊"} {acertosQuiz}/{conteudo.questoes!.length} corretas
              <button onClick={() => { setEnviado(false); setRespostas({}); }}
                className="ml-auto text-xs font-bold underline cursor-pointer opacity-70 hover:opacity-100">Tentar novamente</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AulaCard({ aula, index, concluida, onToggle }: {
  aula: Aula; index: number; concluida: boolean; onToggle: () => void;
}) {
  const [expandida, setExpandida] = useState(false);
  const temMateriais = aula.conteudos.length > 0;

  return (
    <div className={`rounded-3xl border transition ${concluida ? "bg-[#f2fcf5] border-green-200 shadow-sm" : "bg-white border-gray-100 shadow-sm hover:border-gray-200"}`}>
      {/* Cabeçalho da aula */}
      <div className="p-5 md:p-6 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="flex items-start gap-5 flex-1 min-w-0">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm flex-shrink-0 ${concluida ? "bg-[#1b4326] text-white" : "bg-gray-50 text-gray-400 border border-gray-200"}`}>
            {concluida ? "✓" : index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-800 text-base">{aula.titulo}</h4>
            {aula.descricao && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{aula.descricao}</p>}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {aula.duracao && <span className="text-xs text-gray-500 font-bold">⏱️ {aula.duracao}</span>}
              {temMateriais && (
                <span className="text-[10px] font-bold text-[#1b4326] bg-[#f2fcf5] px-2 py-0.5 rounded-md border border-green-100">
                  {aula.conteudos.length} {aula.conteudos.length === 1 ? "material" : "materiais"}
                </span>
              )}
              {[...new Set(aula.conteudos.map(c => c.tipo))].map(t => <BadgeTipo key={t} tipo={t} />)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          {temMateriais && (
            <button onClick={() => setExpandida(o => !o)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#1b4326] bg-white border border-gray-200 hover:bg-[#f2fcf5] hover:border-green-200 transition cursor-pointer">
              {expandida ? "▲ Ocultar" : "▼ Ver Materiais"}
            </button>
          )}
          <button onClick={onToggle}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-sm cursor-pointer ${concluida ? "bg-[#1b4326] text-white hover:bg-[#112e19]" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {concluida ? "✓ Finalizada" : "Marcar como Feita"}
          </button>
        </div>
      </div>

      {/* Materiais expandidos */}
      {expandida && temMateriais && (
        <div className="px-5 md:px-6 pb-5 flex flex-col gap-3 border-t border-gray-100 pt-4">
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Materiais da Aula</p>
          {aula.conteudos.map(c => <MaterialItem key={c.id} conteudo={c} />)}
        </div>
      )}
    </div>
  );
}

// ─── Dashboard Principal ──────────────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter();
  const [carregando, setCarregando]           = useState(true);
  const [abaAtiva, setAbaAtiva]               = useState<"painel" | "cursos" | "configuracoes">("painel");
  const [cursoSelecionadoId, setCursoSelecionadoId] = useState<string | null>(null);
  const [modalCurso, setModalCurso]           = useState<{ aberto: boolean; curso: Curso | null }>({ aberto: false, curso: null });
  const [confirmExcluir, setConfirmExcluir]   = useState<string | null>(null);
  const [toast, setToast]                     = useState<{ visivel: boolean; mensagem: string }>({ visivel: false, mensagem: "" });

  const [perfil, setPerfil]                   = useState<PerfilUsuario>({ nome: "", email: "", empresa: "", papel: "Empreendedor" });
  const [listaCursos, setListaCursos]         = useState<Curso[]>([]);
  const [cursosInscritos, setCursosInscritos] = useState<string[]>([]);
  const [aulasConcluidas, setAulasConcluidas] = useState<string[]>([]);

  // Exibe toast por 2.5 s
  const mostrarToast = (mensagem: string) => {
    setToast({ visivel: true, mensagem });
    setTimeout(() => setToast(t => ({ ...t, visivel: false })), 2500);
  };

  // Carrega dados do localStorage + usuário logado
  useEffect(() => {
    async function init() {
      try {
        const usuario = await obterUsuarioLogado();
        if (!usuario) { router.push("/login"); return; }
        setPerfil({ nome: usuario.nome, email: usuario.email, empresa: usuario.empresa || "", papel: usuario.papel });
        setListaCursos(lsGet<Curso[]>(LS_CURSOS, []));
        setCursosInscritos(lsGet<string[]>(LS_INSCRITOS, []));
        setAulasConcluidas(lsGet<string[]>(LS_CONCLUIDAS, []));
      } catch (err) {
        console.error("Erro ao inicializar dashboard:", err);
      } finally {
        setCarregando(false);
      }
    }
    init();
  }, [router]);

  // Persistência automática sempre que os dados mudam
  useEffect(() => { if (!carregando) lsSet(LS_CURSOS, listaCursos); }, [listaCursos, carregando]);
  useEffect(() => { if (!carregando) lsSet(LS_INSCRITOS, cursosInscritos); }, [cursosInscritos, carregando]);
  useEffect(() => { if (!carregando) lsSet(LS_CONCLUIDAS, aulasConcluidas); }, [aulasConcluidas, carregando]);

  // Inscrição / cancelamento
  const handleAlternarInscricao = (cursoId: string) => {
    const jaInscrito = cursosInscritos.includes(cursoId);
    const novaLista = jaInscrito
      ? cursosInscritos.filter(id => id !== cursoId)
      : [...cursosInscritos, cursoId];
    setCursosInscritos(novaLista);
    if (jaInscrito && cursoSelecionadoId === cursoId) setCursoSelecionadoId(null);
    mostrarToast(jaInscrito ? "Inscrição cancelada." : "Inscrição realizada com sucesso! 🎉");
  };

  // Marcar / desmarcar aula concluída
  const handleAlternarAulaConcluida = (aulaId: string) => {
    const jaConcluida = aulasConcluidas.includes(aulaId);
    setAulasConcluidas(jaConcluida
      ? aulasConcluidas.filter(id => id !== aulaId)
      : [...aulasConcluidas, aulaId]
    );
  };

  // Salvar perfil
  const handleSalvarPerfil = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res = await atualizarPerfil(formData);
      mostrarToast(res.sucesso ? (res.mensagem || "Perfil atualizado!") : (res.erro || "Erro ao salvar."));
    } catch { mostrarToast("Erro ao atualizar o perfil."); }
  };

  // Salvar curso (criar ou editar) → persiste no localStorage
  const salvarCurso = (c: Curso) => {
    setListaCursos(prev =>
      prev.some(x => x.id === c.id) ? prev.map(x => x.id === c.id ? c : x) : [...prev, c]
    );
    setModalCurso({ aberto: false, curso: null });
    mostrarToast(c.id && listaCursos.some(x => x.id === c.id) ? "Curso atualizado!" : "Curso publicado com sucesso! 🚀");
  };

  // Excluir curso — limpa inscrições e aulas concluídas que pertencem ao curso
  const excluirCurso = (id: string) => {
    const curso = listaCursos.find(c => c.id === id);
    if (curso) {
      const idsAulasDoCurso = new Set(curso.aulas.map(a => a.id));
      setAulasConcluidas(prev => prev.filter(aulaId => !idsAulasDoCurso.has(aulaId)));
    }
    setListaCursos(prev => prev.filter(c => c.id !== id));
    setCursosInscritos(prev => prev.filter(i => i !== id));
    if (cursoSelecionadoId === id) setCursoSelecionadoId(null);
    setConfirmExcluir(null);
    mostrarToast("Curso excluído.");
  };

  const calcularProgressoCurso = (curso: Curso) => {
    const ids = curso.aulas.map(a => a.id);
    if (ids.length === 0) return 0;
    return Math.round((ids.filter(id => aulasConcluidas.includes(id)).length / ids.length) * 100);
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

  // Apenas aulas que ainda existem em cursos cadastrados
  const idsAulasExistentes        = new Set(listaCursos.flatMap(c => c.aulas.map(a => a.id)));
  const totalAulasExistentes      = idsAulasExistentes.size;
  const aulasConcluidasValidas    = aulasConcluidas.filter(id => idsAulasExistentes.has(id));
  const progressoGeralPlataforma  = totalAulasExistentes > 0
    ? Math.round((aulasConcluidasValidas.length / totalAulasExistentes) * 100) : 0;
  const cursoAtivoParaExibicao = listaCursos.find(c => c.id === cursoSelecionadoId);
  const cursosAtivos           = listaCursos.filter(c => cursosInscritos.includes(c.id));
  const cursosSugeridos        = listaCursos.filter(c => !cursosInscritos.includes(c.id));

  return (
    <main className="min-h-screen bg-[#f4f5f4] flex font-sans antialiased text-gray-800">

      <Toast mensagem={toast.mensagem} visivel={toast.visivel} />

      {/* Modal Curso */}
      {modalCurso.aberto && (
        <ModalCurso curso={modalCurso.curso} onSalvar={salvarCurso}
          onFechar={() => setModalCurso({ aberto: false, curso: null })} />
      )}

      {/* Confirmação de exclusão */}
      {confirmExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center">
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="text-lg font-extrabold text-gray-800 mb-2">Excluir este curso?</h3>
            <p className="text-sm text-gray-500 mb-6">Todas as aulas e materiais serão removidos. Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setConfirmExcluir(null)} className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition cursor-pointer">Cancelar</button>
              <button onClick={() => excluirCurso(confirmExcluir)} className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition cursor-pointer">Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sidebar ── */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10 shadow-sm">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="relative w-10 h-10 -my-2">
            <Image src={logoImage} alt="Logo" fill className="object-contain" />
          </div>
          <span className="text-xl font-extrabold text-[#1b4326] tracking-tight">EnsinosTech</span>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1.5">
          {([
            { key: "painel",        label: "Painel de Estudos", icon: "📊" },
            { key: "cursos",        label: "Todos os Cursos",   icon: "📚" },
            { key: "configuracoes", label: "Configurações",     icon: "⚙️" },
          ] as const).map(item => (
            <button key={item.key}
              onClick={() => { setAbaAtiva(item.key); setCursoSelecionadoId(null); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition text-left w-full cursor-pointer ${
                abaAtiva === item.key && !cursoSelecionadoId ? "bg-[#f2fcf5] text-[#1b4326]" : "text-gray-600 hover:bg-gray-50 hover:text-[#1b4326]"
              }`}>
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
              <button onClick={async () => { await logout(); }} className="text-[10px] text-red-500 font-extrabold hover:underline text-left cursor-pointer">Sair da Plataforma</button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Conteúdo ── */}
      <div className="flex-1 ml-72 p-8 lg:p-10">

        {/* ── Painel ── */}
        {abaAtiva === "painel" && !cursoSelecionadoId && (
          <div className="max-w-[1400px] mx-auto">
            <header className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-extrabold text-[#1b4326] tracking-tighter">Seu Espaço de Estudos</h1>
                <p className="text-sm text-gray-500 font-semibold mt-0.5">Acompanhe seu avanço no projeto Conecta Empreendedor.</p>
              </div>
              <div className="bg-white border border-gray-200 text-[#1b4326] px-4 py-2 rounded-xl text-xs font-bold shadow-sm hidden md:block">Ambiente Acadêmico</div>
            </header>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 flex flex-col gap-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icone: "🔥", label: "Progresso Geral", valor: `${progressoGeralPlataforma}% concluído`, bg: "bg-[#f2fcf5]", cor: "text-[#1b4326]" },
                    { icone: "📖", label: "Aulas Assistidas", valor: `${aulasConcluidasValidas.length} de ${totalAulasExistentes}`, bg: "bg-blue-50", cor: "text-blue-600" },
                    { icone: "🏆", label: "Certificados", valor: `${cursosAtivos.filter(c => calcularProgressoCurso(c) === 100).length} emitidos`, bg: "bg-amber-50", cor: "text-amber-500" },
                  ].map(s => (
                    <div key={s.label} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                      <div className={`w-12 h-12 ${s.bg} ${s.cor} rounded-xl flex items-center justify-center text-2xl`}>{s.icone}</div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                        <p className="text-xl font-black text-gray-800">{s.valor}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hero do curso ativo */}
                {cursosAtivos.length > 0 && (
                  <div className="bg-[#1b4326] rounded-[2rem] p-8 flex flex-col md:flex-row justify-between items-center text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-72 h-72 bg-[#2a6338] rounded-full blur-3xl opacity-60 z-0"></div>
                    <div className="relative z-10 w-full md:w-2/3">
                      <span className="bg-[#88D66C] text-[#1b4326] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Continue Aprendendo</span>
                      <h2 className="text-3xl font-bold mb-2 tracking-tight">{cursosAtivos[0].titulo}</h2>
                      <p className="text-white/80 text-sm mb-6 leading-relaxed">Retome seus estudos e finalize a próxima aula.</p>
                      <button onClick={() => setCursoSelecionadoId(cursosAtivos[0].id)} className="bg-white text-[#1b4326] px-8 py-3 rounded-xl text-sm font-bold hover:bg-gray-100 transition shadow cursor-pointer">Retomar Trilha →</button>
                    </div>
                    <div className="relative z-10 hidden md:flex text-8xl opacity-20">{cursosAtivos[0].icone}</div>
                  </div>
                )}

                {/* Trilhas ativas */}
                <div>
                  <h2 className="text-xl font-extrabold text-[#1b4326] tracking-tighter mb-4">Suas Trilhas Ativas</h2>
                  {cursosAtivos.length === 0 ? (
                    <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-10 text-center flex flex-col items-center">
                      <div className="text-5xl mb-4">👀</div>
                      <h3 className="text-lg font-bold text-[#1b4326] mb-2">Você ainda não está inscrito em nenhuma trilha</h3>
                      <p className="text-sm text-gray-500 mb-6 max-w-md">Para começar, escolha um curso no catálogo.</p>
                      <button onClick={() => setAbaAtiva("cursos")} className="bg-[#1b4326] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#112e19] transition shadow-sm cursor-pointer">Explorar Catálogo</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {cursosAtivos.map(curso => {
                        const prog = calcularProgressoCurso(curso);
                        return (
                          <div key={curso.id} onClick={() => setCursoSelecionadoId(curso.id)}
                            className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#88D66C]/50 transition cursor-pointer group">
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
                                <span>Progresso</span><span className="text-[#1b4326] font-extrabold">{prog}%</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div className="bg-[#88D66C] h-1.5 rounded-full transition-all duration-500" style={{ width: `${prog}%` }}></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar direita */}
              <div className="xl:col-span-1 flex flex-col gap-6">
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="text-sm font-extrabold text-[#1b4326] uppercase tracking-wider mb-4 flex items-center gap-2"><span>🔔</span> Mural de Avisos</h3>
                  <div className="space-y-4">
                    <div className="border-l-2 border-[#88D66C] pl-3">
                      <p className="text-xs font-bold text-gray-800">Novos Módulos de Marketing</p>
                      <p className="text-[11px] text-gray-500 mt-1">Aprenda a utilizar o tráfego pago nas redes sociais.</p>
                      <span className="text-[9px] font-bold text-[#1b4326] uppercase mt-1 block">Há 2 horas</span>
                    </div>
                    <div className="border-l-2 border-gray-200 pl-3">
                      <p className="text-xs font-bold text-gray-800">Mudanças no Limite do MEI</p>
                      <p className="text-[11px] text-gray-500 mt-1">Fique atento às propostas de aumento do teto.</p>
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
                        <div key={curso.id} onClick={() => setAbaAtiva("cursos")}
                          className="flex gap-4 items-center p-3 rounded-2xl hover:bg-gray-50 transition cursor-pointer border border-transparent hover:border-gray-100">
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

        {/* ── Detalhe do Curso (visão aluno) ── */}
        {cursoSelecionadoId && cursoAtivoParaExibicao && (
          <div className="max-w-[1200px] mx-auto">
            <button onClick={() => setCursoSelecionadoId(null)}
              className="mb-6 text-sm font-bold text-[#1b4326] hover:bg-white hover:shadow-sm px-4 py-2 rounded-xl border border-transparent hover:border-gray-200 transition flex items-center gap-2 cursor-pointer">
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
                {cursoAtivoParaExibicao.cargaHoraria && <p className="text-xs text-gray-400 font-bold mb-6">⏱ Carga horária: {cursoAtivoParaExibicao.cargaHoraria}</p>}
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex justify-between items-center text-sm font-bold text-gray-600 mb-3">
                    <span>Progresso da Trilha</span>
                    <span className="text-[#1b4326] font-black">{calcularProgressoCurso(cursoAtivoParaExibicao)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-[#1b4326] h-3 rounded-full transition-all duration-500" style={{ width: `${calcularProgressoCurso(cursoAtivoParaExibicao)}%` }}></div>
                  </div>
                </div>
                <button onClick={() => handleAlternarInscricao(cursoAtivoParaExibicao.id)}
                  className="w-full mt-8 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 py-3 rounded-xl transition cursor-pointer">
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
                  return (
                    <AulaCard
                      key={aula.id}
                      aula={aula}
                      index={index}
                      concluida={concluida}
                      onToggle={() => handleAlternarAulaConcluida(aula.id)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Catálogo de Cursos ── */}
        {abaAtiva === "cursos" && (
          <div className="max-w-[1400px] mx-auto">
            <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-[#1b4326] tracking-tighter">Catálogo de Trilhas</h1>
                <p className="text-sm text-gray-500 font-semibold mt-0.5">
                  {listaCursos.length} {listaCursos.length === 1 ? "curso disponível" : "cursos disponíveis"} · salvo localmente
                </p>
              </div>
              <button onClick={() => setModalCurso({ aberto: true, curso: null })}
                className="flex items-center gap-2.5 bg-[#1b4326] hover:bg-[#112e19] text-white px-5 py-3 rounded-2xl text-sm font-bold transition shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer whitespace-nowrap">
                <span className="text-base leading-none">＋</span> Cadastrar Novo Curso
              </button>
            </header>

            {listaCursos.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-16 text-center flex flex-col items-center">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-lg font-bold text-[#1b4326] mb-2">Nenhum curso cadastrado ainda</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-md">Clique em "Cadastrar Novo Curso" para adicionar a primeira trilha.</p>
                <button onClick={() => setModalCurso({ aberto: true, curso: null })} className="bg-[#1b4326] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#112e19] transition shadow-sm cursor-pointer">
                  ＋ Cadastrar Primeiro Curso
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listaCursos.map(curso => {
                  const inscrito = cursosInscritos.includes(curso.id);
                  const totalMat = curso.aulas.reduce((acc, a) => acc + a.conteudos.length, 0);
                  return (
                    <div key={curso.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                      <div>
                        <div className="flex justify-between items-start mb-5">
                          <div className="text-5xl">{curso.icone}</div>
                          <div className="flex flex-col items-end gap-1.5">
                            {inscrito && <span className="bg-[#1b4326] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">Inscrito</span>}
                            {curso.nivel && <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{curso.nivel}</span>}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight">{curso.titulo}</h3>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">{curso.descricao}</p>
                      </div>

                      <div className="mt-5 pt-5 border-t border-gray-50">
                        <div className="flex justify-between items-center text-xs font-bold text-gray-400 mb-1">
                          <span>{curso.aulas.length} {curso.aulas.length === 1 ? "Aula" : "Aulas"}</span>
                          <span>{totalMat} {totalMat === 1 ? "Material" : "Materiais"}</span>
                          <span className="text-gray-500">Gratuito</span>
                        </div>
                        {curso.cargaHoraria && <p className="text-[10px] font-bold text-gray-400 mb-3">⏱ {curso.cargaHoraria}</p>}

                        {/* Inscrição */}
                        <div className="flex gap-2 mb-2">
                          <button onClick={() => handleAlternarInscricao(curso.id)}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer shadow-sm ${inscrito ? "bg-white text-red-500 border-red-100 hover:bg-red-50" : "bg-[#1b4326] text-white border-transparent hover:bg-[#112e19]"}`}>
                            {inscrito ? "Cancelar Inscrição" : "Inscrever-se na Trilha"}
                          </button>
                          {inscrito && (
                            <button onClick={() => { setAbaAtiva("painel"); setCursoSelecionadoId(curso.id); }}
                              className="flex-1 bg-[#88D66C] text-[#1b4326] py-2.5 rounded-xl text-xs font-extrabold hover:bg-[#7bc260] transition shadow-sm border border-transparent cursor-pointer">
                              Acessar Aulas
                            </button>
                          )}
                        </div>

                        {/* Gestão */}
                        <div className="flex gap-2">
                          <button onClick={() => setModalCurso({ aberto: true, curso })}
                            className="flex-1 py-2 rounded-xl text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition cursor-pointer">
                            ✏️ Editar Curso
                          </button>
                          <button onClick={() => setConfirmExcluir(curso.id)}
                            className="flex-1 py-2 rounded-xl text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 transition cursor-pointer">
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

        {/* ── Configurações ── */}
        {abaAtiva === "configuracoes" && (
          <div className="max-w-3xl">
            <header className="mb-8">
              <h1 className="text-3xl font-extrabold text-[#1b4326] tracking-tighter">Configurações da Conta</h1>
              <p className="text-sm text-gray-500 font-semibold mt-0.5">Gerencie seus dados de acesso e perfil.</p>
            </header>
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-[#1b4326] mb-6 border-b border-gray-50 pb-4">Dados Cadastrais</h3>
              <form onSubmit={handleSalvarPerfil} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Nome Completo</label>
                    <input type="text" name="nome" value={perfil.nome} required onChange={e => setPerfil({ ...perfil, nome: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:bg-white focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">E-mail de Acesso</label>
                    <input type="email" name="email" value={perfil.email} required onChange={e => setPerfil({ ...perfil, email: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:bg-white focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Nome do Seu Negócio</label>
                  <input type="text" name="empresa" value={perfil.empresa} onChange={e => setPerfil({ ...perfil, empresa: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:bg-white focus:border-[#88D66C] focus:ring-2 focus:ring-[#88D66C]/20 transition" />
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