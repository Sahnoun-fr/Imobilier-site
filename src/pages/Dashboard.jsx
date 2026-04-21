import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const STATUS_COLORS = {
  en_attente: '#f39c12',
  confirmé: '#27ae60',
  annulé: '#c0392b'
}

export default function Dashboard() {
  const [visites, setVisites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase.from('visites')
        .select('*, maisons(titre, ville, adresse, prix)')
        .eq('locataire_id', user.id)
        .order('created_at', { ascending: false })
      setVisites(data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div style={styles.loading}>Chargement...</div>

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Mes visites</h2>
      {visites.length === 0 && <p style={{color:'#888'}}>Aucune visite demandée pour le moment.</p>}
      <div style={styles.list}>
        {visites.map(v => (
          <div key={v.id} style={styles.card}>
            <div style={styles.cardTop}>
              <div>
                <h3 style={styles.maison}>{v.maisons?.titre}</h3>
                <p style={styles.ville}>{v.maisons?.ville} — {v.maisons?.adresse}</p>
              </div>
              <span style={{...styles.badge, background: STATUS_COLORS[v.statut] || '#888'}}>
                {v.statut}
              </span>
            </div>
            <div style={styles.meta}>
              <span>Date : {new Date(v.date_visite).toLocaleString('fr-DZ')}</span>
              <span>{v.maisons?.prix?.toLocaleString()} DA/mois</span>
            </div>
            {v.message && <p style={styles.msg}>"{v.message}"</p>}
            {v.scan_cin_url && (
              <a href={v.scan_cin_url} target="_blank" rel="noreferrer" style={styles.cinLink}>
                Voir le scan CIN
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  page: { padding:'2rem', maxWidth:'800px', margin:'0 auto' },
  heading: { color:'#8B5E2A', marginBottom:'1.5rem' },
  list: { display:'flex', flexDirection:'column', gap:'1rem' },
  card: { background:'white', borderRadius:'12px', padding:'1.5rem', boxShadow:'0 2px 12px rgba(0,0,0,0.08)' },
  cardTop: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' },
  maison: { margin:0, color:'#333' },
  ville: { color:'#8B5E2A', margin:'0.25rem 0 0', fontSize:'0.9rem' },
  badge: { color:'white', padding:'0.25rem 0.75rem', borderRadius:'20px', fontSize:'0.8rem', fontWeight:'600', whiteSpace:'nowrap' },
  meta: { display:'flex', gap:'1.5rem', color:'#666', fontSize:'0.9rem', marginBottom:'0.5rem' },
  msg: { color:'#888', fontStyle:'italic', fontSize:'0.9rem', margin:'0.5rem 0 0' },
  cinLink: { display:'inline-block', marginTop:'0.75rem', color:'#8B5E2A', fontWeight:'600', fontSize:'0.9rem' },
  loading: { padding:'3rem', textAlign:'center' }
}