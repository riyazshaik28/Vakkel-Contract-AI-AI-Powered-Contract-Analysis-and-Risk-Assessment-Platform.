import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle, ArrowLeft, CheckCircle2, ChevronRight, ClipboardList,
  FileCheck2, FileText, Gauge, Loader2, Menu, Search, ShieldCheck,
  Sparkles, UploadCloud, X,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.detail || "Something went wrong");
  return payload;
}

const riskStyles = {
  low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  medium: "bg-amber-50 text-amber-700 ring-amber-200",
  high: "bg-orange-50 text-orange-700 ring-orange-200",
  critical: "bg-rose-50 text-rose-700 ring-rose-200",
};

function RiskBadge({ level = "low" }) {
  const normalized = String(level).toLowerCase();
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ring-1 ${riskStyles[normalized] || riskStyles.low}`}>{normalized}</span>;
}

function App() {
  const [contracts, setContracts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const fileInput = useRef(null);

  const loadContracts = async () => {
    setLoading(true);
    try { setContracts(await request("/contracts/")); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadContracts(); }, []);

  const openContract = async (contract) => {
    setError(""); setWorking(true); setPage("contract"); setSelected(contract); setAnalysis(null);
    try {
      const detail = await request(`/contracts/${contract._id || contract.id}`);
      setSelected(detail.contract);
      try { setAnalysis(await request(`/analysis/contract/${contract._id || contract.id}`)); } catch { /* not analysed yet */ }
    } catch (err) { setError(err.message); }
    finally { setWorking(false); }
  };

  const upload = async (event) => {
    const file = event.target.files?.[0]; if (!file) return;
    setError(""); setWorking(true);
    const body = new FormData(); body.append("file", file);
    try {
      const result = await request("/contracts/upload", { method: "POST", body });
      await loadContracts(); await openContract(result.contract);
    } catch (err) { setError(err.message); }
    finally { setWorking(false); event.target.value = ""; }
  };

  const analyze = async () => {
    if (!selected) return;
    setError(""); setWorking(true);
    try {
      const result = await request(`/analysis/analysis/${selected.id || selected._id}`, { method: "POST" });
      setAnalysis(result.analysis); await loadContracts();
    } catch (err) { setError(err.message); }
    finally { setWorking(false); }
  };

  const filtered = useMemo(() => contracts.filter((item) =>
    (item.original_name || item.filename || "").toLowerCase().includes(query.toLowerCase())), [contracts, query]);
  const analyzedCount = contracts.filter((item) => item.status === "analyzed").length;

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-ink text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <button onClick={() => { setPage("dashboard"); setSelected(null); }} className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal"><ShieldCheck size={22} /></span>
            <span className="text-left"><span className="block font-display text-lg leading-5">Vakeel</span><span className="text-[10px] font-bold uppercase tracking-[0.25em] text-teal-200">Contract AI</span></span>
          </button>
          <div className="hidden items-center gap-6 text-sm text-slate-300 sm:flex"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Secure workspace</span><span>Legal intelligence, simplified</span></div>
          <button className="sm:hidden"><Menu size={21} /></button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {error && <div className="mb-6 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"><span>{error}</span><button onClick={() => setError("")}><X size={17} /></button></div>}
        {page === "dashboard" ? (
          <>
            <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div><p className="eyebrow mb-2">Your legal command center</p><h1 className="font-display text-4xl leading-tight md:text-5xl">Understand every<br /><span className="text-teal">contract</span> with confidence.</h1><p className="mt-3 max-w-xl text-slate-500">Upload a contract and let Vakeel surface the clauses, risks, and recommendations that matter.</p></div>
              <button onClick={() => fileInput.current?.click()} className="flex items-center justify-center gap-2 rounded-xl bg-teal px-5 py-3.5 font-bold text-white shadow-lg shadow-teal/20 transition hover:bg-teal/90"><UploadCloud size={19} /> Upload contract</button>
              <input ref={fileInput} type="file" accept=".pdf,.docx,.txt" onChange={upload} className="hidden" />
            </div>
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              {[["Total contracts", contracts.length, FileText, "All your uploaded documents"], ["Analysed", analyzedCount, Sparkles, "AI reviews completed"], ["Ready to review", contracts.length - analyzedCount, Gauge, "Documents awaiting analysis"]].map(([label, value, Icon, helper]) => <div className="card flex items-center gap-4 p-5" key={label}><span className="grid h-11 w-11 place-items-center rounded-xl bg-teal/10 text-teal"><Icon size={21} /></span><div><p className="text-2xl font-bold">{value}</p><p className="text-sm font-semibold text-slate-600">{label}</p><p className="mt-0.5 text-xs text-slate-400">{helper}</p></div></div>)}
            </div>
            <section className="card overflow-hidden">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center"><div><h2 className="text-lg font-bold">Your contracts</h2><p className="mt-1 text-sm text-slate-400">Keep track of your legal documents and their review status.</p></div><div className="relative"><Search className="absolute left-3 top-2.5 text-slate-400" size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search contracts..." className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-teal sm:w-64" /></div></div>
              {loading ? <Loading /> : filtered.length ? <div className="divide-y divide-slate-100">{filtered.map((contract) => <ContractRow key={contract._id || contract.id} contract={contract} onClick={() => openContract(contract)} />)}</div> : <Empty onUpload={() => fileInput.current?.click()} />}
            </section>
          </>
        ) : <ContractView selected={selected} analysis={analysis} working={working} onBack={() => setPage("dashboard")} onAnalyze={analyze} />}
      </main>
      {working && <div className="fixed bottom-5 right-5 flex items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white shadow-xl"><Loader2 className="animate-spin" size={17} /> Processing document...</div>}
    </div>
  );
}

function ContractRow({ contract, onClick }) {
  const status = contract.status === "analyzed";
  return <button onClick={onClick} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50"><div className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-500"><FileText size={19} /></span><div className="min-w-0"><p className="truncate font-semibold">{contract.original_name || contract.filename}</p><p className="mt-1 text-xs text-slate-400">{contract.page_count || 0} pages · {contract.word_count || 0} words · {contract.upload_date ? new Date(contract.upload_date).toLocaleDateString() : "Recently uploaded"}</p></div></div><div className="flex shrink-0 items-center gap-3">{status ? <span className="hidden items-center gap-1.5 text-xs font-semibold text-emerald-600 sm:flex"><CheckCircle2 size={15} /> Analysed</span> : <span className="hidden text-xs font-semibold text-amber-600 sm:block">Needs review</span>}<ChevronRight className="text-slate-300" size={19} /></div></button>;
}

function ContractView({ selected, analysis, working, onBack, onAnalyze }) {
  if (!selected) return null;
  return <div><button onClick={onBack} className="mb-7 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-ink"><ArrowLeft size={17} /> Back to contracts</button><div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-start"><div><p className="eyebrow mb-2">Contract workspace</p><h1 className="font-display break-all text-3xl">{selected.original_name || selected.filename}</h1><p className="mt-2 text-sm text-slate-500">{selected.page_count || 0} pages · {selected.word_count || 0} words</p></div>{!analysis && <button disabled={working} onClick={onAnalyze} className="flex items-center justify-center gap-2 rounded-xl bg-teal px-5 py-3 font-bold text-white shadow-lg shadow-teal/20 disabled:opacity-60"><Sparkles size={18} /> Analyse with AI</button>}</div>{analysis ? <AnalysisView analysis={analysis} /> : <div className="card grid place-items-center p-12 text-center"><span className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-teal/10 text-teal"><Sparkles size={28} /></span><h2 className="text-xl font-bold">Ready for your legal review</h2><p className="mt-2 max-w-md text-sm leading-6 text-slate-500">Vakeel will identify key clauses, explain their meaning, and flag potential risks in this document.</p></div>}</div>;
}

function AnalysisView({ analysis }) {
  return <div className="space-y-6"><div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]"><div className="card p-6"><p className="eyebrow mb-2">Executive summary</p><h2 className="font-display text-2xl">{analysis.contract_type || "Contract"} review</h2><p className="mt-4 leading-7 text-slate-600">{analysis.summary || "No summary was returned for this analysis."}</p></div><div className="card flex flex-col justify-between p-6"><div><p className="eyebrow mb-3">Overall risk</p><div className="flex items-center gap-3"><AlertTriangle className="text-amber-500" size={25} /><span className="text-3xl font-bold capitalize">{analysis.overall_risk_level || "low"}</span></div></div><p className="mt-6 text-sm text-slate-500">{analysis.risk_flags?.length || 0} potential risk items found</p><RiskBadge level={analysis.overall_risk_level} /></div></div><div className="grid gap-6 lg:grid-cols-2"><Panel title="Key clauses" icon={ClipboardList}>{analysis.key_clauses?.length ? analysis.key_clauses.map((item, index) => <div className="border-b border-slate-100 py-4 last:border-0" key={`${item.clause_title}-${index}`}><div className="flex items-start justify-between gap-3"><h3 className="font-bold">{item.clause_title}</h3><span className={`shrink-0 text-xs font-bold ${item.is_standard ? "text-emerald-600" : "text-amber-600"}`}>{item.is_standard ? "Standard" : "Review"}</span></div><p className="mt-2 text-sm leading-6 text-slate-500">{item.explanation}</p></div>) : <p className="py-4 text-sm text-slate-500">No clauses returned.</p>}</Panel><Panel title="Risk flags" icon={AlertTriangle}>{analysis.risk_flags?.length ? analysis.risk_flags.map((item, index) => <div className="border-b border-slate-100 py-4 last:border-0" key={`${item.risk_title}-${index}`}><div className="flex items-start justify-between gap-3"><h3 className="font-bold">{item.risk_title}</h3><RiskBadge level={item.risk_level} /></div><p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>{item.recommendation && <p className="mt-2 rounded-lg bg-slate-50 p-3 text-xs font-semibold text-slate-600"><span className="text-teal">Recommendation:</span> {item.recommendation}</p>}</div>) : <div className="flex items-center gap-2 py-4 text-sm text-emerald-600"><CheckCircle2 size={17} /> No risk flags found.</div>}</Panel></div>{analysis.recommendations?.length > 0 && <Panel title="Recommendations" icon={FileCheck2}><ul className="grid gap-3 sm:grid-cols-2">{analysis.recommendations.map((item, index) => <li className="flex gap-3 text-sm leading-6 text-slate-600" key={index}><CheckCircle2 className="mt-1 shrink-0 text-teal" size={16} />{item}</li>)}</ul></Panel>}</div>;
}

function Panel({ title, icon: Icon, children }) { return <section className="card p-6"><div className="mb-2 flex items-center gap-2"><Icon className="text-teal" size={19} /><h2 className="text-lg font-bold">{title}</h2></div>{children}</section>; }
function Loading() { return <div className="grid place-items-center p-16 text-slate-400"><Loader2 className="animate-spin" size={24} /></div>; }
function Empty({ onUpload }) { return <div className="grid place-items-center p-14 text-center"><FileText className="mb-3 text-slate-300" size={34} /><h3 className="font-bold">No contracts yet</h3><p className="mt-1 text-sm text-slate-400">Upload your first contract to get started.</p><button onClick={onUpload} className="mt-5 rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white">Upload a contract</button></div>; }

export default App;
