"use client";
import { useState, useEffect } from "react";
import { Card, SectionTitle, BtnGold, BtnGhost, Field, Badge, ReadonlyNotice, StatBox, AlertInfo, inputStyle, C, loadData, saveData, fmtDate, todayStr } from "./ui";

const INITIAL = [
  { id: 1, data: "25/05/2026", titulo: "Campanha Ela Merece Se Ver — Continuidade", texto: "Hoje tem novidade esperando por você na loja, Amiga. Passa lá ou chama no WhatsApp 💛", cat: "Campanha Maio", autor: "lys" },
  { id: 2, data: "10/05/2026", titulo: "Dia das Mães — Mensagem Especial", texto: "Para a mulher que cuida de todo mundo e muitas vezes esquece de cuidar de si. Hoje é o seu dia.", cat: "Data Comemorativa", autor: "lys" },
  { id: 3, data: "01/05/2026", titulo: "Dia do Trabalho — Aquecimento Campanha", texto: "Você trabalha tanto. Hoje é sua vez de ser celebrada.", cat: "Campanha Maio", autor: "lys" },
  { id: 4, data: "28/04/2026", titulo: "Novidades de Inverno chegando", texto: "As primeiras peças da coleção de inverno estão chegando. Fique de olho no @eusoumalu.modas.", cat: "Produto", autor: "malu" },
];

const CATS = ["Campanha Maio", "Data Comemorativa", "Produto", "Engajamento", "Institucional", "Campanha Junho", "Campanha Julho"];

export default function TabGrupo({ user }) {
  const [msgs, setMsgs] = useState(() => loadData("grupo", INITIAL));
  const [form, setForm] = useState({ data: "", titulo: "", texto: "", cat: "Campanha Maio" });

  useEffect(() => { saveData("grupo", msgs); }, [msgs]);

  function add() {
    if (!form.titulo || !form.texto) { alert("Preencha o título e o texto."); return; }
    const novo = {
      id: Date.now(),
      data: form.data ? fmtDate(form.data) : todayStr(),
      titulo: form.titulo,
      texto: form.texto,
      cat: form.cat,
      autor: user.role,
    };
    setMsgs([novo, ...msgs]);
    setForm({ data: "", titulo: "", texto: "", cat: "Campanha Maio" });
  }

  function remove(id) {
    if (!confirm("Remover esta mensagem?")) return;
    setMsgs(msgs.filter(m => m.id !== id));
  }

  const canEdit = user.role === "lys";

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px,1fr))", gap: 10, marginBottom: 20 }}>
        <StatBox num={msgs.length} label="Mensagens" />
        <StatBox num={msgs.filter(m => m.cat.startsWith("Campanha")).length} label="Campanhas" />
        <StatBox num="21" label="Anos de Mercado" />
        <StatBox num="#EuSouMalu" label="Hashtag Âncora" />
      </div>

      <SectionTitle>Mensagens · Grupo Melhores Amigas da Malu</SectionTitle>

      {msgs.map(m => (
        <Card key={m.id} accent>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{
              background: C.black, color: C.gold,
              fontSize: 10, padding: "3px 8px", borderRadius: 4,
              whiteSpace: "nowrap", letterSpacing: "0.04em",
              fontFamily: "Verdana, sans-serif", minWidth: 72, textAlign: "center",
            }}>{m.data}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: 13, color: C.text, fontFamily: "Verdana, sans-serif", marginBottom: 4 }}>{m.titulo}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontFamily: "Verdana, sans-serif", lineHeight: 1.5 }}>{m.texto}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
                <Badge variant={m.autor === "lys" ? "lys" : "malu"}>{m.autor === "lys" ? "Lys" : "Malu Modas"}</Badge>
                <Badge>{m.cat}</Badge>
                {canEdit && (
                  <button onClick={() => remove(m.id)} style={{ background: "transparent", border: "none", color: "rgba(255,80,80,0.5)", cursor: "pointer", fontSize: 11, fontFamily: "Verdana, sans-serif", marginLeft: "auto" }}>remover</button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}

      {!canEdit && <ReadonlyNotice>Você está acessando como Malu Modas. Novas mensagens são criadas pela VI.P & NOUS.</ReadonlyNotice>}

      {canEdit && (
        <>
          <SectionTitle style={{ marginTop: 24 }}>Nova Mensagem para o Grupo</SectionTitle>
          <Card>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
              <Field label="DATA DE ENVIO">
                <input type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="CATEGORIA">
                <select value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })} style={inputStyle}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
            </div>
            <div style={{ marginBottom: 10 }}>
              <Field label="TÍTULO DA MENSAGEM">
                <input type="text" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Ex: Lançamento Coleção Inverno 2026" style={inputStyle} />
              </Field>
            </div>
            <div style={{ marginBottom: 14 }}>
              <Field label="TEXTO DA MENSAGEM">
                <textarea value={form.texto} onChange={e => setForm({ ...form, texto: e.target.value })} placeholder="Texto completo para o grupo Melhores Amigas da Malu..." style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
              </Field>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <BtnGold onClick={add}>Salvar Mensagem</BtnGold>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
