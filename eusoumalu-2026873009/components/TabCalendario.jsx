"use client";
import { useState, useEffect } from "react";
import { Card, SectionTitle, BtnGold, Field, Badge, ReadonlyNotice, AlertInfo, inputStyle, C, loadData, saveData, fmtDate } from "./ui";

const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const MONTHS_SHORT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

const SCOPE_COLORS = {
  "Brasil": { bg: "rgba(34,180,100,0.12)", color: "#4caf7a", border: "rgba(34,180,100,0.3)" },
  "Adamantina/SP": { bg: "rgba(200,169,110,0.12)", color: "#C8A96E", border: "rgba(200,169,110,0.3)" },
  "Mundial": { bg: "rgba(80,140,220,0.12)", color: "#7aaae8", border: "rgba(80,140,220,0.3)" },
  "Malu Modas": { bg: "rgba(139,105,20,0.18)", color: "#C8A96E", border: "rgba(200,169,110,0.5)" },
};

const INITIAL_DATES = [
  { id: 1, month: 0, day: "01", name: "Confraternização Universal", scope: "Brasil", rel: "Abertura de ano — post institucional" },
  { id: 2, month: 0, day: "25", name: "Dia do Feirante", scope: "Brasil", rel: "Relevância para comércio local" },
  { id: 3, month: 1, day: "08", name: "Dia Internacional da Mulher (prep)", scope: "Mundial", rel: "Aquecimento para 8 de março" },
  { id: 4, month: 2, day: "08", name: "Dia Internacional da Mulher", scope: "Mundial", rel: "Post de empoderamento — pilar central da marca" },
  { id: 5, month: 2, day: "22", name: "Aniversário de Leticia Santos", scope: "Malu Modas", rel: "Data pessoal da empresária" },
  { id: 6, month: 2, day: "25", name: "Aniversário de Adamantina", scope: "Adamantina/SP", rel: "Post comemorativo local — fidelização" },
  { id: 7, month: 3, day: "21", name: "Tiradentes", scope: "Brasil", rel: "Feriado — oportunidade de campanha" },
  { id: 8, month: 4, day: "01", name: "Dia do Trabalho", scope: "Brasil", rel: "Campanha Ela Merece Se Ver — Aquecimento" },
  { id: 9, month: 4, day: "10", name: "Dia das Mães", scope: "Brasil", rel: "Pico da Campanha Maio — maior data do ano" },
  { id: 10, month: 4, day: "16", name: "Fundação da Malu Modas", scope: "Malu Modas", rel: "21 anos — post institucional comemorativo" },
  { id: 11, month: 5, day: "12", name: "Dia dos Namorados", scope: "Brasil", rel: "Curadoria de looks para presentear" },
  { id: 12, month: 5, day: "24", name: "Festa Junina / São João", scope: "Brasil", rel: "Look caipira chic — conteúdo de engajamento" },
  { id: 13, month: 5, day: "29", name: "Dia de São Pedro", scope: "Brasil", rel: "Encerramento de junho festivo" },
  { id: 14, month: 6, day: "25", name: "Dia do Comerciante", scope: "Brasil", rel: "Post de valorização do comércio local" },
  { id: 15, month: 7, day: "10", name: "Dia do Índio / Povos Originários", scope: "Brasil", rel: "Post de diversidade e respeito" },
  { id: 16, month: 7, day: "11", name: "Dia dos Pais", scope: "Brasil", rel: "Curadoria de looks masculinos — presente para ele" },
  { id: 17, month: 7, day: "15", name: "Dia dos Solteiros (Single Day China)", scope: "Mundial", rel: "Engajamento divertido — conteúdo de autoestima" },
  { id: 18, month: 8, day: "07", name: "Independência do Brasil", scope: "Brasil", rel: "Post patriótico — look verde e amarelo" },
  { id: 19, month: 8, day: "21", name: "Início da Primavera", scope: "Brasil", rel: "Coleção primavera/verão — renovação de peças" },
  { id: 20, month: 9, day: "12", name: "Nossa Senhora Aparecida / Dia das Crianças", scope: "Brasil", rel: "Conteúdo de fé e família" },
  { id: 21, month: 9, day: "15", name: "Dia das Crianças", scope: "Brasil", rel: "Conteúdo familiar — mãe e filha" },
  { id: 22, month: 9, day: "31", name: "Halloween", scope: "Mundial", rel: "Post de engajamento lúdico" },
  { id: 23, month: 10, day: "02", name: "Finados", scope: "Brasil", rel: "Pausa em campanhas de venda" },
  { id: 24, month: 10, day: "15", name: "Proclamação da República", scope: "Brasil", rel: "Feriado — oportunidade de ação" },
  { id: 25, month: 10, day: "20", name: "Dia da Consciência Negra", scope: "Brasil", rel: "Post de diversidade, inclusão e representatividade" },
  { id: 26, month: 11, day: "01", name: "Início do Natal — Aquecimento", scope: "Malu Modas", rel: "Abertura da campanha de fim de ano" },
  { id: 27, month: 11, day: "25", name: "Natal", scope: "Mundial", rel: "Pico da campanha de fim de ano — maior ticket médio" },
  { id: 28, month: 11, day: "31", name: "Réveillon", scope: "Mundial", rel: "Post de retrospectiva, gratidão e projeção 2027" },
];

export default function TabCalendario({ user }) {
  const [dates, setDates] = useState(() => loadData("calendario", INITIAL_DATES));
  const [selectedMonth, setSelectedMonth] = useState(4);
  const [form, setForm] = useState({ month: 4, day: "", name: "", scope: "Brasil", rel: "" });

  useEffect(() => { saveData("calendario", dates); }, [dates]);

  const visible = dates.filter(d => d.month === selectedMonth).sort((a, b) => parseInt(a.day) - parseInt(b.day));
  const canEdit = user.role === "lys";

  function add() {
    if (!form.name || !form.day) { alert("Preencha o dia e o nome da data."); return; }
    setDates([...dates, { id: Date.now(), ...form, month: parseInt(form.month), day: String(form.day).padStart(2, "0") }]);
    setForm({ month: selectedMonth, day: "", name: "", scope: "Brasil", rel: "" });
  }

  function remove(id) {
    if (!confirm("Remover esta data?")) return;
    setDates(dates.filter(d => d.id !== id));
  }

  return (
    <div>
      <SectionTitle>Calendário Editorial 2026</SectionTitle>
      <AlertInfo>Datas estratégicas para Adamantina/SP, Brasil e Mundo — integradas ao planejamento @eusoumalu.modas</AlertInfo>

      {/* Month selector */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
        {MONTHS_SHORT.map((m, i) => (
          <button key={i} onClick={() => setSelectedMonth(i)} style={{
            background: selectedMonth === i ? C.gold : "transparent",
            color: selectedMonth === i ? C.black : "rgba(255,255,255,0.45)",
            border: `0.5px solid ${selectedMonth === i ? C.gold : "rgba(255,255,255,0.15)"}`,
            borderRadius: 20,
            padding: "5px 12px",
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "Verdana, sans-serif",
            fontWeight: selectedMonth === i ? "bold" : "normal",
            transition: "all 0.15s",
          }}>{m}</button>
        ))}
      </div>

      <div style={{ marginBottom: 8, fontSize: 12, color: C.gold, fontFamily: "Verdana, sans-serif", fontWeight: "bold", letterSpacing: "0.06em" }}>
        {MONTHS[selectedMonth].toUpperCase()} · {visible.length} {visible.length === 1 ? "data" : "datas"}
      </div>

      {visible.length === 0 && (
        <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, padding: "20px 0", fontFamily: "Verdana, sans-serif" }}>
          Nenhuma data cadastrada para {MONTHS[selectedMonth]}.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10, marginBottom: 20 }}>
        {visible.map(d => {
          const sc = SCOPE_COLORS[d.scope] || SCOPE_COLORS["Brasil"];
          return (
            <div key={d.id} style={{
              background: C.bg3,
              borderRadius: 10,
              padding: "12px 14px",
              borderLeft: `3px solid ${C.gold}`,
              position: "relative",
            }}>
              <div style={{ fontSize: 10, color: C.goldDark, letterSpacing: "0.1em", fontWeight: "bold", fontFamily: "Verdana, sans-serif", textTransform: "uppercase", marginBottom: 2 }}>{MONTHS[d.month]}</div>
              <div style={{ fontSize: 26, fontWeight: "bold", color: "#fff", fontFamily: "Verdana, sans-serif", lineHeight: 1 }}>{d.day}</div>
              <div style={{ fontSize: 13, color: "#fff", fontFamily: "Verdana, sans-serif", margin: "4px 0 2px" }}>{d.name}</div>
              <div style={{
                display: "inline-block",
                background: sc.bg, color: sc.color,
                border: `0.5px solid ${sc.border}`,
                borderRadius: 20, padding: "2px 8px", fontSize: 10,
                fontFamily: "Verdana, sans-serif", marginBottom: 4,
              }}>{d.scope}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "Verdana, sans-serif", lineHeight: 1.4 }}>{d.rel}</div>
              {canEdit && (
                <button onClick={() => remove(d.id)} style={{
                  position: "absolute", top: 8, right: 8,
                  background: "transparent", border: "none",
                  color: "rgba(255,80,80,0.4)", cursor: "pointer", fontSize: 11,
                  fontFamily: "Verdana, sans-serif",
                }}>✕</button>
              )}
            </div>
          );
        })}
      </div>

      {!canEdit && <ReadonlyNotice>Calendário gerenciado pela VI.P & NOUS. Visualização disponível para Malu Modas.</ReadonlyNotice>}

      {canEdit && (
        <>
          <SectionTitle>Adicionar Data ao Calendário</SectionTitle>
          <Card>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
              <Field label="MÊS">
                <select value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} style={inputStyle}>
                  {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
              </Field>
              <Field label="DIA">
                <input type="number" min="1" max="31" value={form.day} onChange={e => setForm({ ...form, day: e.target.value })} placeholder="Ex: 15" style={inputStyle} />
              </Field>
              <Field label="ESCOPO">
                <select value={form.scope} onChange={e => setForm({ ...form, scope: e.target.value })} style={inputStyle}>
                  {Object.keys(SCOPE_COLORS).map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
              <Field label="NOME DA DATA">
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Dia dos Namorados" style={inputStyle} />
              </Field>
              <Field label="RELEVÂNCIA PARA A MALU">
                <input type="text" value={form.rel} onChange={e => setForm({ ...form, rel: e.target.value })} placeholder="Ex: Curadoria de looks para presentear" style={inputStyle} />
              </Field>
            </div>
            <BtnGold onClick={add}>Adicionar Data</BtnGold>
          </Card>
        </>
      )}
    </div>
  );
}
