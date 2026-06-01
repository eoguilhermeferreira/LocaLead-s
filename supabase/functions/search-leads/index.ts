// NOTE: APIFY_API_TOKEN must be set as a secret in Supabase Dashboard
// supabase secrets set APIFY_API_TOKEN=your_token_here

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { nicho, cidade, estado, qty = 10, status, scoreMin } = await req.json()

    const apifyToken = Deno.env.get('APIFY_API_TOKEN')
    if (!apifyToken) {
      return new Response(JSON.stringify({ error: 'APIFY_API_TOKEN not configured', leads: [] }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const searchQuery = `${nicho || 'negócios'} em ${cidade || 'São Paulo'}, ${estado || 'SP'}, Brasil`

    // Start Apify Google Maps Scraper actor run
    const runResp = await fetch(
      `https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token=${apifyToken}&timeout=55`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchStringsArray: [searchQuery],
          maxCrawledPlacesPerSearch: Math.min(qty, 20),
          language: 'pt',
          countryCode: 'br',
          includeWebResults: false,
        }),
      }
    )

    if (!runResp.ok) {
      const errText = await runResp.text()
      return new Response(JSON.stringify({ error: `Apify error: ${errText}`, leads: [] }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const items: any[] = await runResp.json()

    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ leads: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const leads = items.map((place: any) => {
      const rating = place.totalScore || 0
      const reviews = place.reviewsCount || 0
      const phone = place.phone || place.phoneUnformatted || ''
      const website = place.website || ''
      const hasSite = !!website

      // Score calculation
      let score = 40
      if (rating >= 4.5) score += 20
      else if (rating >= 4.0) score += 15
      else if (rating >= 3.5) score += 10
      if (reviews >= 100) score += 20
      else if (reviews >= 50) score += 15
      else if (reviews >= 20) score += 10
      else if (reviews >= 10) score += 5
      if (!hasSite) score += 15
      if (phone) score += 5
      score = Math.min(score, 99)

      const whatsappRaw = phone.replace(/\D/g, '')
      const whatsapp = whatsappRaw.startsWith('55') ? whatsappRaw : `55${whatsappRaw}`
      const priority = score >= 85 ? 'Alta' : score >= 70 ? 'Média' : 'Normal'
      const opportunityLevel = score >= 85 ? 'Alta oportunidade' : score >= 70 ? 'Boa oportunidade' : 'Oportunidade'

      return {
        id: `lead-${place.placeId || place.cid || Math.random().toString(36).slice(2)}`,
        name: place.title || place.name || '',
        nicho: nicho || 'Serviços',
        cidade,
        estado,
        score,
        hasSite,
        phone,
        website,
        whatsapp,
        address: place.address || place.street || '',
        rating,
        reviews,
        priority,
        opportunityLevel,
        mapsUrl: place.url || `https://maps.google.com/?q=${encodeURIComponent(place.title || '')}`,
        placeId: place.placeId || '',
      }
    })

    // Filter by status and score
    let filtered = leads
    if (status === 'sem-site') filtered = filtered.filter((l: any) => !l.hasSite)
    if (status === 'com-site') filtered = filtered.filter((l: any) => l.hasSite)
    if (scoreMin && scoreMin !== 'todos') filtered = filtered.filter((l: any) => l.score >= parseInt(scoreMin))

    return new Response(JSON.stringify({ leads: filtered }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, leads: [] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
