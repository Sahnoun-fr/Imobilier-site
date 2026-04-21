import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link } from 'react-router-dom'

export default function Home() {
  const [maisons, setMaisons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('maisons').select('*').eq('disponible', true)
      .then(({ data }) => { setMaisons(data || []); setLoading(false) })
  }, [])

  if (loading) return <div style={styles.loading}>Chargement des maisons...</div>

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Maisons disponibles</h2>
      <div style={styles.grid}>
        {maisons.map(m => (
          <Link to={`/maison/${m.id}`} key={m.id} style={styles.card}>
            {m.image_url && (
              <div style={{...styles.image, backgroundImage: `url(${m.image_url})`}} />
            )}
            <h3 style={styles.cardTitle}>{m.titre}</h3>
            <p style={styles.ville}>{m.ville}</p>
            <p style={styles.adresse}>{m.adresse}</p>
            <p style={styles.prix}>{m.prix?.toLocaleString()} DA / mois</p>
          </Link>
        ))}
        {maisons.length === 0 && <p>Aucune maison disponible pour le moment.</p>}
      </div>
    </div>
  )
}

const styles = {
  page: { padding:'2rem', maxWidth:'1100px', margin:'0 auto' },
  heading: { color:'#8B5E2A', marginBottom:'1.5rem' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.5rem' },
  card: { background:'white', borderRadius:'12px', padding:'1.5rem', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', textDecoration:'none', color:'inherit', position:'relative', transition:'box-shadow 0.2s', overflow:'hidden' },
  image: { height:'160px', width:'calc(100% + 3rem)', margin:'-1.5rem -1.5rem 1rem -1.5rem', backgroundSize:'cover', backgroundPosition:'center' },
  badge: { position:'absolute', top:'1rem', right:'1rem', background:'#8B5E2A', color:'white', padding:'0.2rem 0.6rem', borderRadius:'20px', fontSize:'0.8rem' },
  cardTitle: { margin:'0 0 0.5rem', color:'#333', fontSize:'1.1rem' },
  ville: { color:'#8B5E2A', fontWeight:'600', margin:'0 0 0.25rem' },
  adresse: { color:'#888', fontSize:'0.9rem', margin:'0 0 0.75rem' },
  prix: { color:'#27ae60', fontWeight:'700', fontSize:'1.1rem', margin:0 },
  sup: { color:'#aaa', fontSize:'0.85rem', margin:'0.25rem 0 0' },
  loading: { padding:'3rem', textAlign:'center', color:'#888' }
}