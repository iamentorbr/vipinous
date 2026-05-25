"use client";
import { useState, useEffect } from "react";
import { Card, SectionTitle, BtnGold, BtnGhost, Field, Badge, ReadonlyNotice, StatBox, inputStyle, C, loadData, saveData, fmtDate, todayStr } from "./ui";

const INITIAL = [
  {
    id: 1, data: "25/05/2026", tipo: "Planejamento (Segunda)", titulo: "Sessão de Planejamento — Maio 2026",
    resumo: "Revisão da campanha "Ela Merece Se Ver" — análise de engajamento da Fase Aquecimento e Intensificação. Ajuste de copy para a Fase Virada com foco no pós-Dia das Mães. Definição de pauta para junho: pré-inverno e lançamento de novas peças. Alinhamento sobre perfil @eusoumalu.modas: crescimento orgânico em andamento.",
    tags: ["Campanha Maio", "Instagram", "Planejamento Junho"], autor: "lys"
  },
  {
    id: 2, data: "Fevereiro 2026", tipo: "Onboarding", titulo: "Onboarding NousNUMBER — Leticia & Malu Modas",
    resumo: "Entrega e apresentação do Mapa Numerológico Pessoal de Leticia dos Santos e do Mapa Empresarial da Malu Modas. Apresentação do relatório de Numerologia Geográfica do ponto comercial (Av. Rio Branco 570/574). Alinhamento de acerto de assinatura (Leticia S.) e leitura do Mapa Arquetípico e Comportamental.",
    tags: ["NousNUMBER", "Onboarding", "Estratégia"], autor: "lys"
  },
];

const TIPOS = ["Planejamento (Segunda)", "Entrega e Análise (Sexta)", "Onboarding", "Reunião Extraordinária", "Sessão de Ajuste"];

export default function TabEncontros({ user }) {
  const [encontros, setEncontros] = useState(() => loadData("encontros", INITIAL));
  const [form, setForm] = useState({ data: "", tipo: "Planejamento (Segunda)", titulo: "", resumo: "", tags: "" });
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => { saveData("encontros", encontros); }, [encontros]);

  function add() {
    if (!form.titulo || !form.resumo) { alert("Preencha o título e o resumo."); return; }
    const novo = {
      id: Date.now(),
      data: form.data ? fmtDate(form.data) : todayStr(),
      tipo: form.tipo,
      titulo: form.titulo,
      resumo: form.resumo,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      autor: user.role,
    };
    setEncontros([novo, ...encontros]);
    setForm({ data: "", tipo: "Planejamento (Segunda)", titulo: "", resumo: "", tags: "" });
  }

  function remove(id) {
    if (!confirm("Remover este encontro?")) return;
    setEncontros(encontros.filter(e => e.id !== id));
  }

  function exportPDF(enc) {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head>
      <meta charset="UTF-8"/>
      <title>${enc.titulo}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: Verdana, sans-serif; background: #fff; color: #1A1A1A; padding: 60px 70px; }
        .header { border-bottom: 2px solid #C8A96E; padding-bottom: 20px; margin-bottom: 30px; }
        .brand { font-size: 11px; letter-spacing: 0.2em; color: #8B6914; font-weight: bold; margin-bottom: 4px; }
        .brand-sub { font-size: 10px; letter-spacing: 0.12em; color: #aaa; }
        h1 { font-family: 'Cormorant Garamond', Verdana, serif; font-size: 26px; color: #1A1A1A; margin: 20px 0 6px; font-weight: 700; }
        .meta { font-size: 11px; color: #888; letter-spacing: 0.06em; margin-bottom: 6px; }
        .badge { display: inline-block; background: #F5F0E8; color: #8B6914; border-radius: 20px; padding: 3px 10px; font-size: 10px; margin-right: 6px; font-weight: bold; letter-spacing: 0.04em; }
        .section { margin-top: 28px; }
        .section-label { font-size: 10px; letter-spacing: 0.12em; color: #C8A96E; font-weight: bold; text-transform: uppercase; margin-bottom: 10px; border-bottom: 0.5px solid #e8e0d0; padding-bottom: 6px; }
        .resumo { font-size: 14px; line-height: 1.8; color: #333; }
        .tags { margin-top: 20px; }
        .footer { margin-top: 60px; border-top: 0.5px solid #e8e0d0; padding-top: 14px; font-size: 10px; color: #bbb; letter-spacing: 0.06em; display: flex; justify-content: space-between; }
        @media print { body { padding: 40px 50px; } }
      </style>
    </head><body>
      <div class="header">
        <div class="brand">EU SOU MALU · MALU MODAS</div>
        <div class="brand-sub">VI.P &amp; NOUS CONSULTORIA · GESTÃO DE COMUNICAÇÃO</div>
      </div>
      <div class="meta">${enc.tipo} · ${enc.data}</div>
      <h1>${enc.titulo}</h1>
      <div class="tags">${(enc.tags || []).map(t => `<span class="badge">${t}</span>`).join("")}</div>
      <div class="section">
        <div class="section-label">Resumo do Encontro</div>
        <div class="resumo">${enc.resumo.replace(/\n/g, "<br/>")}</div>
      </div>
      <div class="footer">
        <span>VI.P &amp; NOUS Consultoria · vipinous.com.br</span>
        <span>Documento gerado em ${new Date().toLocaleDateString("pt-BR")}</span>
      </div>
      <script>window.onload = () => { window.print(); }</script>
    </body></html>`);
    win.document.close();
  }

  function exportAll() {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head>
      <meta charset="UTF-8"/>
      <title>Resumo Completo de Encontros — Malu Modas 2026</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: Verdana, sans-serif; background: #fff; color: #1A1A1A; padding: 60px 70px; }
        .cover { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; border-bottom: 2px solid #C8A96E; margin-bottom: 60px; }
        .brand { font-size: 11px; letter-spacing: 0.2em; color: #8B6914; font-weight: bold; margin-bottom: 8px; }
        h1 { font-size: 32px; color: #1A1A1A; font-weight: bold; margin: 12px 0 6px; }
        .sub { font-size: 13px; color: #888; }
        .enc { margin-bottom: 50px; page-break-inside: avoid; border-bottom: 0.5px solid #e8e0d0; padding-bottom: 30px; }
        .enc-meta { font-size: 10px; color: #999; letter-spacing: 0.08em; margin-bottom: 4px; }
        .enc-title { font-size: 18px; font-weight: bold; color: #1A1A1A; margin-bottom: 8px; }
        .badge { display: inline-block; background: #F5F0E8; color: #8B6914; border-radius: 20px; padding: 2px 8px; font-size: 10px; margin-right: 4px; font-weight: bold; }
        .label { font-size: 10px; letter-spacing: 0.1em; color: #C8A96E; font-weight: bold; text-transform: uppercase; margin: 14px 0 6px; }
        .resumo { font-size: 13px; line-height: 1.8; color: #333; }
        .footer { margin-top: 40px; font-size: 10px; color: #bbb; text-align: center; }
        @media print { .enc { page-break-inside: avoid; } }
      </style>
    </head><body>
      <div class="cover">
        <div class="brand">VI.P &amp; NOUS CONSULTORIA</div>
        <h1>Resumo Completo de Encontros<br/>Malu Modas 2026</h1>
        <div class="sub">Lys × Leticia Santos · ${encontros.length} encontros registrados · Gerado em ${new Date().toLocaleDateString("pt-BR")}</div>
      </div>
      ${encontros.map(e => `
        <div class="enc">
          <div class="enc-meta">${e.tipo} · ${e.data}</div>
          <div class="enc-title">${e.titulo}</div>
          <div>${(e.tags || []).map(t => `<span class="badge">${t}</span>`).join("")}</div>
          <div class="label">Resumo</div>
          <div class="resumo">${e.resumo.replace(/\n/g, "<br/>")}</div>
        </div>
      `).join("")}
      <div class="footer">VI.P &amp; NOUS Consultoria · vipinous.com.br · Malu Modas / LETS MODA LTDA</div>
      <script>window.onload = () => { window.print(); }</script>
    </body></html>`);
    win.document.close();
  }

  const canEdit = user.role === "lys";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <SectionTitle>Resumos dos Encontros — Lys × Leticia</SectionTitle>
        <BtnGhost onClick={exportAll} style={{ fontSize: 11, padding: "6px 14px" }}>Exportar Todos em PDF</BtnGhost>
      </div>

      {encontros.map(enc => (
        <div key={enc.id} style={{
          background: C.bg3,
          border: `0.5px solid ${C.border}`,
          borderRadius: 12,
          padding: "14px 16px",
          marginBottom: 12,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: 14, color: "#fff", fontFamily: "Verdana, sans-serif", marginBottom: 2 }}>{enc.titulo}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "Verdana, sans-serif", marginBottom: 8 }}>
                {enc.tipo} · {enc.data}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <BtnGhost onClick={() => exportPDF(enc)} style={{ fontSize: 11, padding: "5px 12px" }}>PDF</BtnGhost>
              {canEdit && <button onClick={() => remove(enc.id)} style={{ background: "transparent", border: "none", color: "rgba(255,80,80,0.4)", cursor: "pointer", fontSize: 11, fontFamily: "Verdana, sans-serif" }}>remover</button>}
            </div>
          </div>

          <div
            style={{
              fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "Verdana, sans-serif", lineHeight: 1.6,
              maxHeight: expandedId === enc.id ? "none" : "60px",
              overflow: "hidden",
              cursor: "pointer",
            }}
            onClick={() => setExpandedId(expandedId === enc.id ? null : enc.id)}
          >
            {enc.resumo}
          </div>
          <button onClick={() => setExpandedId(expandedId === enc.id ? null : enc.id)} style={{
            background: "transparent", border: "none", color: C.gold,
            fontSize: 11, cursor: "pointer", fontFamily: "Verdana, sans-serif", marginTop: 4, padding: 0,
          }}>
            {expandedId === enc.id ? "▲ recolher" : "▼ ler mais"}
          </button>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
            {(enc.tags || []).map(t => <Badge key={t}>{t}</Badge>)}
            <Badge variant={enc.autor === "lys" ? "lys" : "malu"}>{enc.autor === "lys" ? "Lys" : "Malu Modas"}</Badge>
          </div>
        </div>
      ))}

      {!canEdit && <ReadonlyNotice>Resumos são registrados pela VI.P & NOUS. Você tem acesso de leitura e exportação de PDF.</ReadonlyNotice>}

      {canEdit && (
        <>
          <SectionTitle style={{ marginTop: 24 }}>Registrar Novo Encontro</SectionTitle>
          <Card>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
              <Field label="DATA">
                <input type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="TIPO DE SESSÃO">
                <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} style={inputStyle}>
                  {TIPOS.map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>
            </div>
            <div style={{ marginBottom: 10 }}>
              <Field label="TÍTULO DO ENCONTRO">
                <input type="text" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Ex: Planejamento Junho — Coleção Inverno" style={inputStyle} />
              </Field>
            </div>
            <div style={{ marginBottom: 10 }}>
              <Field label="RESUMO DO ENCONTRO">
                <textarea value={form.resumo} onChange={e => setForm({ ...form, resumo: e.target.value })} placeholder="Descreva os pontos discutidos, decisões tomadas e próximos passos..." style={{ ...inputStyle, minHeight: 100, resize: "vertical" }} />
              </Field>
            </div>
            <div style={{ marginBottom: 14 }}>
              <Field label="TAGS (separadas por vírgula)">
                <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Ex: Instagram, Junho, Inverno, NousNUMBER" style={inputStyle} />
              </Field>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <BtnGold onClick={add}>Registrar Encontro</BtnGold>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
