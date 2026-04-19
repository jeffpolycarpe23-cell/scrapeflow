import React, { useState } from "react";

export default function ScrapeFlow() {
  const [tab, setTab] = useState("scraper");
  const [scrapeType, setScrapeType] = useState("contacts");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");

  const DEMO_DATA = {
    contacts: [
      { name: "Sophie Martin", email: "s.martin@agence.fr", phone: "+33612345678" },
      { name: "Karim Benali", email: "k.benali@tech.io", phone: "+33798765432" },
      { name: "Laura Fontaine", email: "laura@studio.com", phone: "+33655443322" },
    ],
    products: [
      { name: "MacBook Pro 14", price: "2199 EUR", stock: "En stock" },
      { name: "Dell XPS 15", price: "1799 EUR", stock: "En stock" },
      { name: "iPhone 16 Pro", price: "1229 EUR", stock: "En stock" },
    ],
    sites: [
      { name: "TechCrunch", url: "techcrunch.com", trafic: "12M/mois" },
      { name: "Le Journal du Net", url: "journaldunet.com", trafic: "3.2M/mois" },
      { name: "BFM Business", url: "bfmtv.com", trafic: "8.1M/mois" },
    ]
  };

  const handleScrape = async () => {
    if (!query) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setResults(DEMO_DATA[scrapeType]);
    setLoading(false);
  };

  const handleAI = async () => {
    if (!aiPrompt) return;
    setAiLoading(true);
    try {
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          messages: [{
            role: "user",
            content: `Tu es expert en scraping. Reponds a cette question en francais, concis: ${aiPrompt}`
          }]
        })
      });
      const data = await response.json();
      setAiResult(data.content?.[0]?.text || "Erreur");
    } catch (err) {
      setAiResult("Erreur de connexion");
    }
    setAiLoading(false);
  };

  const exportCSV = () => {
    if (!results) return;
    const headers = Object.keys(results[0]);
    const rows = results.map(r => headers.map(h => r[h]).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scrapeflow_${scrapeType}.csv`;
    a.click();
  };

  return (
    <div style={{ background: "#0a0f1a", color: "#e2e8f0", fontFamily: "system-ui", minHeight: "100vh" }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        button { cursor: pointer; border: none; fontFamily: inherit; }
        input, textarea { fontFamily: inherit; }
        input:focus, textarea:focus { outline: none; }
      `}</style>

      <div style={{ background: "#070c15", padding: "16px 20px", borderBottom: "1px solid #1a2035", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>⚡ ScrapeFlow</div>
        <div style={{ fontSize: 12, color: "#666" }}>v1.0</div>
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid #1a2035", background: "#070c15" }}>
        {["scraper", "ai", "settings"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "12px 20px",
              background: tab === t ? "#1a2035" : "transparent",
              color: tab === t ? "#7b61ff" : "#666",
              borderBottom: tab === t ? "2px solid #7b61ff" : "none",
              fontSize: 14,
              fontWeight: 600
            }}
          >
            {t === "scraper" ? "⚡ Scraper" : t === "ai" ? "🤖 IA" : "⚙️ Config"}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px" }}>

        {tab === "scraper" && (
          <div>
            <h1 style={{ fontSize: 24, marginBottom: 20 }}>Nouveau Scrape</h1>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 10, fontWeight: 600 }}>TYPE DE DONNEES</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { id: "contacts", label: "👤 Contacts" },
                  { id: "products", label: "📦 Produits" },
                  { id: "sites", label: "🌐 Sites Web" }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setScrapeType(t.id)}
                    style={{
                      padding: "14px",
                      border: scrapeType === t.id ? "2px solid #7b61ff" : "1px solid #1a2035",
                      background: scrapeType === t.id ? "rgba(123,97,255,0.1)" : "#070c15",
                      borderRadius: 8,
                      color: "#e2e8f0",
                      fontWeight: 600,
                      transition: "all 0.2s"
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 8, fontWeight: 600 }}>RECHERCHE</label>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Ex: agences SEO Paris..."
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  background: "#070c15",
                  border: "1px solid #1a2035",
                  borderRadius: 8,
                  color: "#e2e8f0",
                  fontSize: 14
                }}
              />
            </div>

            <button
              onClick={handleScrape}
              disabled={loading || !query}
              style={{
                padding: "12px 28px",
                background: loading ? "#1a2035" : "#7b61ff",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                opacity: !query ? 0.5 : 1,
                marginBottom: 24
              }}
            >
              {loading ? "⏳ Scraping..." : "⚡ Lancer le Scrape"}
            </button>

            {results && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h2 style={{ fontSize: 16, color: "#00e5ff" }}>Resultats ({results.length})</h2>
                  <button
                    onClick={exportCSV}
                    style={{
                      padding: "8px 14px",
                      background: "rgba(0,229,255,0.1)",
                      border: "1px solid #00e5ff",
                      color: "#00e5ff",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    📥 CSV
                  </button>
                </div>

                <div style={{ overflowX: "auto", border: "1px solid #1a2035", borderRadius: 8 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#070c15" }}>
                        {Object.keys(results[0]).map(h => (
                          <th key={h} style={{ padding: "10px", textAlign: "left", color: "#7b61ff", fontWeight: 600, borderBottom: "1px solid #1a2035" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((row, i) => (
                        <tr key={i} style={{ background: i % 2 ? "#0d1320" : "#070c15" }}>
                          {Object.values(row).map((v, j) => (
                            <td key={j} style={{ padding: "10px", borderBottom: "1px solid #1a2035", color: "#cbd5e0" }}>
                              {v}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "ai" && (
          <div>
            <h1 style={{ fontSize: 24, marginBottom: 20 }}>Assistant IA</h1>
            <p style={{ color: "#888", marginBottom: 16 }}>Posez vos questions sur la strategie de scraping</p>

            <textarea
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              placeholder="Ex: Comment scraper 200 restaurants bio a Paris avec emails?"
              rows={4}
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "#070c15",
                border: "1px solid #1a2035",
                borderRadius: 8,
                color: "#e2e8f0",
                fontSize: 14,
                marginBottom: 12,
                resize: "vertical"
              }}
            />

            <button
              onClick={handleAI}
              disabled={aiLoading || !aiPrompt}
              style={{
                padding: "12px 28px",
                background: aiLoading ? "#1a2035" : "#7b61ff",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                opacity: !aiPrompt ? 0.5 : 1,
                marginBottom: 20
              }}
            >
              {aiLoading ? "🤖 Reflexion..." : "🤖 Demander a l'IA"}
            </button>

            {aiResult && (
              <div style={{
                background: "#070c15",
                border: "1px solid #1a2035",
                borderRadius: 8,
                padding: "16px",
                color: "#cbd5e0",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap"
              }}>
                <div style={{ fontSize: 11, color: "#7b61ff", fontWeight: 700, marginBottom: 10 }}>REPONSE IA</div>
                {aiResult}
              </div>
            )}
          </div>
        )}

        {tab === "settings" && (
          <div>
            <h1 style={{ fontSize: 24, marginBottom: 20 }}>Parametres</h1>
            <div style={{ background: "#070c15", padding: "20px", borderRadius: 8, border: "1px solid #1a2035" }}>
              <p style={{ color: "#888" }}>Plan Freelance</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: "#7b61ff", marginTop: 10 }}>500 scrapes/mois</p>
              <div style={{ background: "#1a2035", borderRadius: 99, height: 8, marginTop: 12, overflow: "hidden" }}>
                <div style={{ width: "24%", height: "100%", background: "linear-gradient(90deg, #7b61ff, #00e5ff)" }} />
              </div>
              <p style={{ fontSize: 12, color: "#888", marginTop: 8 }}>120/500 utilises</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
