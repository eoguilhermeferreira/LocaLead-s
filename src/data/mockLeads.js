const firstNames = ['Studio','Clínica','Espaço','Centro','Instituto','Barbearia','Academia','Salão','Oficina','Pet']
const secondNames = ['Premium','Vida','Saúde','Beleza','Moderno','Express','Top','Plus','Master','Elite']
const streets = ['Rua das Flores','Av. Brasil','Rua do Comércio','Av. Paulista','Rua 7 de Setembro','Av. Central']

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function randItem(arr) { return arr[randInt(0, arr.length - 1)] }

export function generateMockLeads(nicho, cidade, estado, quantity = 10) {
  return Array.from({ length: quantity }, (_, i) => {
    const score = randInt(35, 98)
    const hasSite = Math.random() > 0.6
    const reviews = randInt(8, 420)
    const rating = (Math.random() * 2 + 3).toFixed(1)
    return {
      id: `lead-${Date.now()}-${i}`,
      name: `${randItem(firstNames)} ${randItem(secondNames)} ${nicho?.split(' ')[0] || ''}`.trim(),
      nicho: nicho || 'Serviços',
      cidade: cidade || 'São Paulo',
      estado: estado || 'SP',
      score,
      hasSite,
      phone: `(${randInt(11, 99)}) 9${randInt(1000, 9999)}-${randInt(1000, 9999)}`,
      whatsapp: `55${randInt(11, 99)}9${randInt(10000000, 99999999)}`,
      address: `${randItem(streets)}, ${randInt(100, 9999)}`,
      rating: parseFloat(rating),
      reviews,
      priority: score >= 85 ? 'Alta' : score >= 70 ? 'Média' : 'Normal',
      opportunityLevel: score >= 85 ? 'Alta oportunidade' : score >= 70 ? 'Boa oportunidade' : 'Oportunidade',
      mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(nicho + ' ' + cidade)}`,
    }
  })
}
