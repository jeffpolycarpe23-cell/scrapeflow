import { useState, useEffect, useRef } from "react";

const DEMO_RESULTS = {
  contacts: [
    { name: "Sophie Martin", email: "s.martin@agence-pixel.fr", phone: "+33 6 12 34 56 78", company: "Agence Pixel", site: "agence-pixel.fr", linkedin: "linkedin.com/in/sophiemartin" },
    { name: "Karim Benali", email: "k.benali@techstart.io", phone: "+33 7 98 76 54 32", company: "TechStart", site: "techstart.io", linkedin: "linkedin.com/in/karimbenali" },
    { name: "Laura Fontaine", email: "laura@creativestudio.com", phone: "+33 6 55 44 33 22", company: "Creative Studio", site: "creativestudio.com", linkedin: "linkedin.com/in/laurafontaine" },
    { name: "Thomas Dupont", email: "t.dupont@webmarketing.fr", phone: "+33 6 11 22 33 44", company: "WebMarketing", site: "webmarketing.fr", linkedin: "linkedin.com/in/thomasdupont" },
    { name: "Amélie Roux", email: "aroux@ecom-solutions.fr", phone: "+33 7 77 88 99 00", company: "Ecom Solutions", site: "ecom-solutions.fr", linkedin: "linkedin.com/in/amelieroux" },
  ],
  products: [
    { name: "MacBook Pro 14 M3", price: "2 199 EUR", source: "apple.com", category: "Ordinateurs", stock: "En stock", rating: "4.8/5" },
    { name: "Dell XPS 15", price: "1 799 EUR", source: "dell.com", category: "Ordinateurs", stock: "En stock", rating: "4.6/5" },
    { name: "Sony WH-1000XM5", price: "349 EUR", source: "sony.fr", category: "Audio", stock: "En stock", rating: "4.9/5" },
    { name: "iPhone 16 Pro", price: "1 229 EUR", source: "apple.com", category: "Smartphones", stock: "En stock", rating: "4.7/5" },
    { name: "Samsung Galaxy S25", price: "1 099 EUR", source: "samsung.com", category: "Smartphones", stock: "Limité", rating: "4.5/5" },
  ],
  sites: [
    { name: "TechCrunch", url: "techcrunch.com", category: "Tech", DA: 93, trafic: "12M/mois", langue: "EN", contact: "tips@techcrunch.com" },
    { name: "Le Journal du Net", url: "journaldunet.com", category: "Business", DA: 78, trafic: "3.2M/mois", langue: "FR", contact: "redaction@jdn.com" },
    { name: "BFM Business", url: "bfmtv.com/economie", category: "Finance", DA: 85, trafic: "8.1M/mois", langue: "FR", contact: "contact@bfmbusiness.com" },
    { name: "Frenchweb", url: "frenchweb.fr", category: "Startups", DA: 65, trafic: "900K/mois", langue: "FR", contact: "news@frenchweb.fr" },
    { name: "L'Usine Digitale", url: "usine-digitale.fr", category: "Industrie", DA: 70, trafic: "1.1M/mois", langue: "FR", contact: "redaction@usine-digitale.fr" },
  ]
};

const SCRAPE_TYPES = [
  { id: "contacts", label: "Contacts / Leads", icon: "👤", desc: "Emails, téléphones, LinkedIn, noms d'entreprises" },
  { id: "products", label: "Produits", icon: "📦", desc: "Prix, stocks, descriptions, images" },
  { id: "sites", label: "Sites Web", icon: "🌐", desc: "URLs, métriques, DA, trafic, contacts" },
];

function exportToCSV(data, type) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(h => `"${row[h]}"`).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `scrapeflow_${type}_${Date.now()}.csv`;
  a.click();
}

function Spinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div className="spinner" />
      <span style={{ color: "#a0aec0", fontSize: 14 }}>Scraping en cours...</span>
    </div>
  );
}

function ProgressBar({ progress }) {
  return (
    <div style={{ background: "#1a1f2e", borderRadius: 99, height: 6, overflow: "hidden", margin: "16px 0" }}>
      <div style={{
        height: "100%", borderRadius: 99,
        background: "linear-gradient(90deg, #00e5ff, #7b61ff)",
        width: `${progress}%`,
        transition: "width 0.3s ease"
      }} />
    </div>
  );
}

function ResultTable({ data, type }) {
  if (!data.length) return null;
  const headers = Object.keys(data[0]);
  return (
    <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid #1e2738" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#0f1520" }}>
            {headers.map(h => (
              <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "#7b61ff", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#0b1019" : "#0d1320", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#12192b"}
              onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#0b1019" : "#0d1320"}>
              {headers.map(h => (
                <td key={h} style={{ padding: "9px 14px", color: "#cbd5e0", borderTop: "1px solid #1a2035", whiteSpace: "nowrap" }}>{row[h]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ScrapeFlow() {
  const [tab, setTab] = useState("scraper");
  const [scrapeType, setScrapeType] = useState("contacts");
  const [query, setQuery] = useState("");
  const [url, setUrl] = useState("");
  const [maxItems, setMaxItems] = useState(50);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([
    { id: 1, type: "contacts", query: "agences SEO Paris", count: 42, date: "15 avr 2026", status: "done" },
    { id: 2, type: "products", query: "laptop gaming fnac.com", count: 87, date: "14 avr 2026", status: "done" },
    { id: 3, type: "sites", query: "blogs cuisine français", count: 30, date: "12 avr 2026", status: "done" },
  ]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const intervalRef = useRef(null);

  const handleScrape = async () => {
    if (!query && !url) return;
    setLoading(true);
    setProgress(0);
    setResults(null);

    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 92) { clearInterval(intervalRef.current); return 92; }
        return p + Math.random() * 12;
      });
    }, 300);

    await new Promise(r => setTimeout(r, 3200));
    clearInterval(intervalRef.current);
    setProgress(100);

    const data = DEMO_RESULTS[scrapeType].slice(0, Math.min(maxItems, DEMO_RESULTS[scrapeType].length));
    setResults(data);
    setLoading(false);
    setHistory(prev => [{
      id: prev.length + 1,
      type: scrapeType,
      query: query || url,
      count: data.length,
      date: "Aujourd'hui",
      status: "done"
    }, ...prev]);
  };

  const handleAI = async () => {
    if (!aiPrompt) return;
    setAiLoading(true);
    setAiResult("");

    const response = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `Tu es un assistant expert en scraping web et en collecte de donnees pour freelances.
Un client freelance te pose cette question : "${aiPrompt}"

Reponds en francais, de facon concise et pratique. Si c'est une demande de strategie de scraping, donne :
- Les meilleures sources a scraper
- Les champs de donnees a extraire
- Des tips professionnels
- Une estimation de volume de donnees

Reste concis (max 200 mots).`
        }]
      })
    });

    const data = await response.json();
    const text = data.content?.find(b => b.type === "text")?.text || "Erreur de reponse.";
    setAiResult(text);
    setAiLoading(false);
  };

  const stats = [
    { label: "Scrapes effectues", value: "1 247", icon: "⚡" },
    { label: "Donnees exportees", value: "48 932", icon: "📊" },
    { label: "Clients actifs", value: "12", icon: "👥" },
    { label: "Taux de succes", value: "98.4%", icon: "✅" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #070c15; color: #e2e8f0; font-family: 'Syne', sans-serif; min-height: 100vh; }
        .mono { font-family: 'Space Mono', monospace; }
        .spinner {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid #1e2738;
          border-top-color: #00e5ff;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px);} to { opacity:1; transform:translateY(0);} }
        .card { animation: fadeUp 0.4s ease both; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0b1019; }
        ::-webkit-scrollbar-thumb { background: #1e2f4a; border-radius: 99px; }
        textarea, input, select { outline: none; }
        textarea:focus, input:focus, select:focus { border-color: #7b61ff !important; }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar */}
        <div style={{
          width: 220, background: "#0a0f1a", borderRight: "1px solid #1a2035",
          display: "flex", flexDirection: "column", padding: "28px 0", flexShrink: 0
        }}>
          <div style={{ padding: "0 20px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: "linear-gradient(135deg, #7b61ff, #00e5ff)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16
              }}>⚡</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em" }}>ScrapeFlow</div>
                <div style={{ fontSize: 10, color: "#4a5568", fontFamily: "Space Mono", marginTop: 1 }}>v1.0 freelance</div>
              </div>
            </div>
          </div>

          {[
            { id: "scraper", icon: "⚡", label: "Scraper" },
            { id: "history", icon: "🕐", label: "Historique" },
            { id: "ai", icon: "🤖", label: "Assistant IA" },
            { id: "settings", icon: "⚙️", label: "Parametres" },
          ].map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "11px 20px", border: "none", cursor: "pointer",
              background: tab === item.id ? "linear-gradient(90deg, rgba(123,97,255,0.15), transparent)" : "transparent",
              color: tab === item.id ? "#fff" : "#4a5568",
              borderLeft: tab === item.id ? "2px solid #7b61ff" : "2px solid transparent",
              fontSize: 14, fontFamily: "Syne, sans-serif", fontWeight: 600,
              textAlign: "left", transition: "all 0.2s"
            }}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}

          <div style={{ flex: 1 }} />
          <div style={{ padding: "16px 20px", borderTop: "1px solid #1a2035", fontSize: 12, color: "#2d3748" }}>
            <div style={{ fontFamily: "Space Mono", marginBottom: 4 }}>Plan Freelance</div>
            <div style={{ color: "#7b61ff", fontWeight: 700 }}>500 scrapes / mois</div>
            <div style={{ marginTop: 6, background: "#0f1520", borderRadius: 99, height: 4, overflow: "hidden" }}>
              <div style={{ width: "24%", height: "100%", background: "linear-gradient(90deg, #7b61ff, #00e5ff)", borderRadius: 99 }} />
            </div>
            <div style={{ color: "#4a5568", marginTop: 4 }}>120 / 500 utilises</div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Top bar */}
          <div style={{
            padding: "16px 28px", borderBottom: "1px solid #1a2035",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#08111d"
          }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em" }}>
                {tab === "scraper" && "Nouveau Scrape"}
                {tab === "history" && "Historique des Scrapes"}
                {tab === "ai" && "Assistant IA"}
                {tab === "settings" && "Parametres"}
              </h1>
              <div style={{ fontSize: 12, color: "#4a5568", marginTop: 2, fontFamily: "Space Mono" }}>
                Samedi 18 avril 2026 API connectee
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{
                padding: "7px 14px", borderRadius: 8, background: "rgba(0,229,255,0.08)",
                border: "1px solid rgba(0,229,255,0.2)", fontSize: 12, color: "#00e5ff",
                fontFamily: "Space Mono", display: "flex", alignItems: "center", gap: 6
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00e5ff", animation: "spin 2s linear infinite" }} />
                API active
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>

            {/* SCRAPER TAB */}
            {tab === "scraper" && (
              <div style={{ maxWidth: 860, margin: "0 auto" }}>
                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
                  {stats.map((s, i) => (
                    <div key={i} className="card" style={{
                      background: "#0d1320", border: "1px solid #1a2035", borderRadius: 14,
                      padding: "16px 18px", animationDelay: `${i * 0.06}s`
                    }}>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", fontFamily: "Space Mono" }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: "#4a5568", marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="card" style={{
                  background: "#0d1320", border: "1px solid #1a2035",
                  borderRadius: 18, padding: 28, animationDelay: "0.15s"
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#7b61ff", marginBottom: 16, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Type de donnees
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
                    {SCRAPE_TYPES.map(t => (
                      <button key={t.id} onClick={() => setScrapeType(t.id)} style={{
                        padding: "14px 16px", borderRadius: 12, cursor: "pointer", textAlign: "left",
                        border: scrapeType === t.id ? "1px solid #7b61ff" : "1px solid #1a2035",
                        background: scrapeType === t.id ? "rgba(123,97,255,0.12)" : "#0a0f1a",
                        transition: "all 0.2s"
                      }}>
                        <div style={{ fontSize: 22, marginBottom: 6 }}>{t.icon}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: scrapeType === t.id ? "#fff" : "#718096" }}>{t.label}</div>
                        <div style={{ fontSize: 11, color: "#4a5568", marginTop: 3 }}>{t.desc}</div>
                      </button>
                    ))}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, color: "#4a5568", marginBottom: 8, fontFamily: "Space Mono" }}>
                        Recherche / Mots-cles
                      </label>
                      <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="ex: agences SEO Paris..."
                        style={{
                          width: "100%", padding: "11px 14px", borderRadius: 10,
                          background: "#070c15", border: "1px solid #1a2035",
                          color: "#e2e8f0", fontSize: 14, fontFamily: "Syne, sans-serif",
                          transition: "border 0.2s"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, color: "#4a5568", marginBottom: 8, fontFamily: "Space Mono" }}>
                        URL source (optionnel)
                      </label>
                      <input
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        placeholder="ex: https://pages-jaunes.fr"
                        style={{
                          width: "100%", padding: "11px 14px", borderRadius: 10,
                          background: "#070c15", border: "1px solid #1a2035",
                          color: "#e2e8f0", fontSize: 14, fontFamily: "Syne, sans-serif",
                          transition: "border 0.2s"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontSize: 12, color: "#4a5568", marginBottom: 8, fontFamily: "Space Mono" }}>
                      Nombre max d'elements : <span style={{ color: "#7b61ff" }}>{maxItems}</span>
                    </label>
                    <input
                      type="range" min={10} max={500} step={10} value={maxItems}
                      onChange={e => setMaxItems(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#7b61ff" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#2d3748", marginTop: 4 }}>
                      <span>10</span><span>250</span><span>500</span>
                    </div>
                  </div>

                  {loading && <ProgressBar progress={progress} />}

                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <button onClick={handleScrape} disabled={loading || (!query && !url)} style={{
                      padding: "12px 28px", borderRadius: 10, border: "none", cursor: "pointer",
                      background: loading ? "#1a2035" : "linear-gradient(135deg, #7b61ff, #00b4d8)",
                      color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "Syne, sans-serif",
                      transition: "all 0.2s", opacity: (!query && !url) ? 0.5 : 1
                    }}>
                      {loading ? <Spinner /> : "⚡ Lancer le Scrape"}
                    </button>

                    {results && (
                      <button onClick={() => exportToCSV(results, scrapeType)} style={{
                        padding: "12px 20px", borderRadius: 10, cursor: "pointer",
                        border: "1px solid #1a5f7a", background: "rgba(0,229,255,0.07)",
                        color: "#00e5ff", fontWeight: 700, fontSize: 13, fontFamily: "Syne, sans-serif"
                      }}>
                        📥 Export CSV
                      </button>
                    )}

                    {results && (
                      <div style={{ fontSize: 12, color: "#4a5568", fontFamily: "Space Mono" }}>
                        {results.length} resultats trouves
                      </div>
                    )}
                  </div>
                </div>

                {/* Results */}
                {results && (
                  <div className="card" style={{
                    background: "#0d1320", border: "1px solid #1a2035",
                    borderRadius: 18, padding: 24, marginTop: 20, animationDelay: "0s"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#00e5ff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        Resultats — {results.length} entrees
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => exportToCSV(results, scrapeType)} style={{
                          padding: "7px 14px", fontSize: 12, borderRadius: 8, cursor: "pointer",
                          border: "1px solid #1a5f7a", background: "transparent", color: "#00e5ff", fontFamily: "Syne, sans-serif", fontWeight: 600
                        }}>CSV</button>
                        <button style={{
                          padding: "7px 14px", fontSize: 12, borderRadius: 8, cursor: "pointer",
                          border: "1px solid #2d5a27", background: "transparent", color: "#48bb78", fontFamily: "Syne, sans-serif", fontWeight: 600
                        }}>Google Sheets</button>
                        <button style={{
                          padding: "7px 14px", fontSize: 12, borderRadius: 8, cursor: "pointer",
                          border: "1px solid #744210", background: "transparent", color: "#f6ad55", fontFamily: "Syne, sans-serif", fontWeight: 600
                        }}>Excel</button>
                      </div>
                    </div>
                    <ResultTable data={results} type={scrapeType} />
                  </div>
                )}
              </div>
            )}

            {/* HISTORY TAB */}
            {tab === "history" && (
              <div style={{ maxWidth: 800, margin: "0 auto" }}>
                <div className="card" style={{
                  background: "#0d1320", border: "1px solid #1a2035",
                  borderRadius: 18, overflow: "hidden"
                }}>
                  {history.map((item, i) => (
                    <div key={item.id} style={{
                      padding: "18px 24px",
                      borderBottom: i < history.length - 1 ? "1px solid #1a2035" : "none",
                      display: "flex", alignItems: "center", gap: 16
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: "#0a0f1a", border: "1px solid #1a2035",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
                      }}>
                        {SCRAPE_TYPES.find(t => t.id === item.type)?.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{item.query}</div>
                        <div style={{ fontSize: 12, color: "#4a5568", marginTop: 2, fontFamily: "Space Mono" }}>
                          {SCRAPE_TYPES.find(t => t.id === item.type)?.label} · {item.date}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          padding: "4px 10px", borderRadius: 99,
                          background: "rgba(0,229,255,0.1)", color: "#00e5ff",
                          fontSize: 12, fontFamily: "Space Mono", fontWeight: 700
                        }}>{item.count} entrees</div>
                        <button onClick={() => exportToCSV(DEMO_RESULTS[item.type], item.type)} style={{
                          padding: "7px 14px", fontSize: 12, borderRadius: 8, cursor: "pointer",
                          border: "1px solid #1a2035", background: "#070c15", color: "#718096",
                          fontFamily: "Syne, sans-serif", fontWeight: 600
                        }}>download CSV</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI TAB */}
            {tab === "ai" && (
              <div style={{ maxWidth: 700, margin: "0 auto" }}>
                <div className="card" style={{
                  background: "#0d1320", border: "1px solid #1a2035",
                  borderRadius: 18, padding: 28
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#7b61ff", marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Assistant IA Scraping
                  </div>
                  <div style={{ fontSize: 13, color: "#4a5568", marginBottom: 20 }}>
                    Posez vos questions sur la strategie de scraping, les sources a utiliser...
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <textarea
                      value={aiPrompt}
                      onChange={e => setAiPrompt(e.target.value)}
                      placeholder="ex: Mon client veut une liste de 200 restaurants bio a Paris avec leurs emails. Quelle est la meilleure strategie ?"
                      rows={4}
                      style={{
                        width: "100%", padding: "14px", borderRadius: 12,
                        background: "#070c15", border: "1px solid #1a2035",
                        color: "#e2e8f0", fontSize: 14, fontFamily: "Syne, sans-serif",
                        resize: "vertical", transition: "border 0.2s"
                      }}
                    />
                    <button onClick={handleAI} disabled={aiLoading || !aiPrompt} style={{
                      alignSelf: "flex-start", padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer",
                      background: "linear-gradient(135deg, #7b61ff, #00b4d8)",
                      color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "Syne, sans-serif",
                      opacity: !aiPrompt ? 0.5 : 1
                    }}>
                      {aiLoading ? <Spinner /> : "🤖 Demander a l'IA"}
                    </button>
                  </div>

                  {aiResult && (
                    <div style={{
                      marginTop: 24, padding: 20, borderRadius: 12,
                      background: "#070c15", border: "1px solid #1a2035",
                      fontSize: 14, lineHeight: 1.7, color: "#cbd5e0",
                      whiteSpace: "pre-wrap"
                    }}>
                      <div style={{ fontSize: 11, color: "#7b61ff", fontFamily: "Space Mono", marginBottom: 10 }}>REPONSE IA</div>
                      {aiResult}
                    </div>
                  )}

                  <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {[
                      "Meilleures sources pour leads B2B",
                      "Scraper LinkedIn legalement",
                      "Donnees e-commerce a extraire",
                      "Prix et delais estimes client"
                    ].map(s => (
                      <button key={s} onClick={() => setAiPrompt(s)} style={{
                        padding: "7px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12,
                        border: "1px solid #1a2035", background: "#0a0f1a", color: "#4a5568",
                        fontFamily: "Syne, sans-serif", transition: "all 0.15s"
                      }}
                        onMouseEnter={e => { e.target.style.borderColor = "#7b61ff"; e.target.style.color = "#c4b5fd"; }}
                        onMouseLeave={e => { e.target.style.borderColor = "#1a2035"; e.target.style.color = "#4a5568"; }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {tab === "settings" && (
              <div style={{ maxWidth: 600, margin: "0 auto" }}>
                <div className="card" style={{
                  background: "#0d1320", border: "1px solid #1a2035",
                  borderRadius: 18, padding: 28
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#7b61ff", marginBottom: 20, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Configuration
                  </div>
                  {[
                    { label: "Google Sheets API Key", placeholder: "AIza...", type: "password" },
                    { label: "Webhook URL (export auto)", placeholder: "https://...", type: "text" },
                    { label: "Delai entre requetes (ms)", placeholder: "1500", type: "number" },
                  ].map((f, i) => (
                    <div key={i} style={{ marginBottom: 18 }}>
                      <label style={{ display: "block", fontSize: 12, color: "#4a5568", marginBottom: 8, fontFamily: "Space Mono" }}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} style={{
                        width: "100%", padding: "11px 14px", borderRadius: 10,
                        background: "#070c15", border: "1px solid #1a2035",
                        color: "#e2e8f0", fontSize: 14, fontFamily: "Space Mono",
                        transition: "border 0.2s"
                      }} />
                    </div>
                  ))}
                  <button style={{
                    padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer",
                    background: "linear-gradient(135deg, #7b61ff, #00b4d8)",
                    color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "Syne, sans-serif",
                  }}>
                    Sauvegarder
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
}
