const handleScrape = async () => {
  if (!query) return;
  setLoading(true);
  
  try {
    const endpoint = scrapeType === 'contacts' ? '/api/scrape/contacts' : '/api/scrape/products';
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    
    const data = await response.json();
    
    if (data.results) {
      setResults(data.results);
    } else {
      setResults(DEMO_DATA[scrapeType]);
    }
  } catch (err) {
    console.error('Scrape error:', err);
    setResults(DEMO_DATA[scrapeType]);
  }
  
  setLoading(false);
};
