// NOTE: GOOGLE_PLACES_API_KEY must be set as a secret in Supabase Dashboard
// supabase secrets set GOOGLE_PLACES_API_KEY=your_key_here

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { nicho, cidade, estado, qty = 10, status, scoreMin } = await req.json()

    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY')
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GOOGLE_PLACES_API_KEY not configured', leads: [] }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const query = `${nicho || 'negócios'} em ${cidade || 'São Paulo'}, ${estado || 'SP'}, Brasil`

    // Text Search API
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&language=pt-BR&region=br&key=${apiKey}`

    const searchResp = await fetch(searchUrl)
    const searchData = await searchResp.json()

    if (!searchData.results || searchData.results.length === 0) {
      return new Response(JSON.stringify({ leads: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get details for each place (phone, website)
    const places = searchData.results.slice(0, Math.min(qty, 20))

    const leads = await Promise.all(places.map(async (place: any) => {
      let phone = ''
      let website = ''

      try {
        const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=formatted_phone_number,website,formatted_address&language=pt-BR&key=${apiKey}`
        const detailResp = await fetch(detailUrl)
        const detailData = await detailResp.json()
        phone = detailData.result?.formatted_phone_number || ''
        website = detailData.result?.website || ''
      } catch (e) {
        // ignore detail errors
      }

      const rating = place.rating || 0
      const reviews = place.user_ratings_total || 0
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
      if (!hasSite) score += 15  // sem site = maior oportunidade
      if (phone) score += 5
      score = Math.min(score, 99)

      const whatsapp = phone.replace(/\D/g, '')
      const priority = score >= 85 ? 'Alta' : score >= 70 ? 'Média' : 'Normal'
      const opportunityLevel = score >= 85 ? 'Alta oportunidade' : score >= 70 ? 'Boa oportunidade' : 'Oportunidade'

      return {
        id: `lead-${place.place_id}`,
        name: place.name,
        nicho: nicho || 'Serviços',
        cidade,
        estado,
        score,
        hasSite,
        phone,
        website,
        whatsapp: whatsapp.startsWith('55') ? whatsapp : `55${whatsapp}`,
        address: place.formatted_address || place.vicinity || '',
        rating,
        reviews,
        priority,
        opportunityLevel,
        mapsUrl: `https://maps.google.com/?place_id=${place.place_id}`,
        placeId: place.place_id,
      }
    }))

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
