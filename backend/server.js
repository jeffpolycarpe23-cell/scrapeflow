import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import puppeteer from 'puppeteer'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}))
app.use(express.json({ limit: '10mb' }))

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Endpoint pour scraper les contacts
app.post('/api/scrape/contacts', async (req, res) => {
  const { query } = req.body

  if (!query) {
    return res.status(400).json({ error: 'Query required' })
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`, {
      waitUntil: 'networkidle2'
    })

    const results = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('div.g')).slice(0, 5).map(el => ({
        title: el.querySelector('h3')?.textContent || 'N/A',
        url: el.querySelector('a')?.href || 'N/A',
        description: el.querySelector('.VwiC3b')?.textContent || 'N/A'
      }))
    })

    await browser.close()

    res.json({
      query,
      count: results.length,
      results
    })
  } catch (err) {
    console.error('Scraping error:', err)
    res.status(500).json({ error: 'Scraping failed', details: err.message })
  }
})

// Endpoint pour scraper les produits (exemple Amazon)
app.post('/api/scrape/products', async (req, res) => {
  const { query } = req.body

  if (!query) {
    return res.status(400).json({ error: 'Query required' })
  }

  try {
    // Pour l'exemple, on retourne des données de démo
    // En production, vous scrapez Amazon/autre site
    const demoProducts = [
      { name: `${query} - Product 1`, price: '29.99', source: 'amazon.com', rating: '4.5/5' },
      { name: `${query} - Product 2`, price: '39.99', source: 'ebay.com', rating: '4.2/5' },
      { name: `${query} - Product 3`, price: '24.99', source: 'walmart.com', rating: '4.7/5' },
    ]

    res.json({
      query,
      count: demoProducts.length,
      results: demoProducts
    })
  } catch (err) {
    res.status(500).json({ error: 'Scraping failed', details: err.message })
  }
})

// Proxy Claude API
app.post('/api/claude', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json(data)
    }

    res.json(data)
  } catch (err) {
    console.error('Claude proxy error:', err)
    res.status(500).json({ error: 'Proxy failed', details: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`)
})
