import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Maison() {
  const { id } = useParams()
  const [maison, setMaison] = useState(null)
  const [date, setDate] = useState('')
  const [message, setMessage] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('maisons').select('*').eq('id', id).single()
      .then(({ data }) => setMaison(data))
  }, [id])

  async function handleReserver(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()

    let scan_cin_url = null
    if (file) {
      const fileName = `${user.id}/${Date.now()}_${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('scan-cin').upload(fileName, file)
      if (uploadError) { setError("Erreur upload: " + uploadError.message); setLoading(false); return }
      const { data: urlData } = supabase.storage.from('scan-cin').getPublicUrl(fileName)
      scan_cin_url = urlData.publicUrl
    }

    const { error: insertError } = await supabase.from('visites').insert({
      locataire_id: user.id,
      maison_id: id,
      date_visite: date,
      message,
      scan_cin_url,
      statut: 'en_attente'
    })

    if (insertError) setError(insertError.message)
    else setSuccess(true)
    setLoading(false)
  }

  if (!maison) return <div style={styles.loading}>Chargement...</div>

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>{maison.titre}</h2>
        <p style={styles.ville}>{maison.ville} — {maison.adresse}</p>
        <p style={styles.desc}>{maison.description}</p>
        <div style={styles.infos}>
          <span>{maison.nb_chambres} chambres</span>
          {maison.superficie_m2 && <span>{maison.superficie_m2} m²</span>}
          <span style={styles.prix}>{maison.prix_mois?.toLocaleString()} DA/mois</span>
        </div>
        <hr style={{margin:'1.5rem 0', border:'none', borderTop:'1px solid #eee'}}/>
        {success ? (
          <div style={styles.success}>
            Visite demandée avec succès ! Vous pouvez suivre votre demande dans votre tableau de bord.
          </div>
        ) : (
          <>
            <h3 style={styles.formTitle}>Demander une visite</h3>
            <form onSubmit={handleReserver} style={styles.form}>
              <label style={styles.label}>Date souhaitée</label>
              <input style={styles.input} type="datetime-local"
                value={date} onChange={e => setDate(e.target.value)} required />
              <label style={styles.label}>Message (optionnel)</label>
              <textarea style={{...styles.input, resize:'vertical', minHeight:'80px'}}
                placeholder="Votre message..." value={message}
                onChange={e => setMessage(e.target.value)} />
              <label style={styles.label}>Scan de votre CIN (obligatoire)</label>
              <input style={styles.input} type="file" accept="image/*,.pdf"
                onChange={e => setFile(e.target.files[0])} required />
              {error && <p style={styles.error}>{error}</p>}
              <button style={styles.btn} type="submit" disabled={loading}>
                {loading ? 'Envoi en cours...' : 'Confirmer la demande'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { padding:'2rem', maxWidth:'700px', margin:'0 auto' },
  card: { background:'white', borderRadius:'12px', padding:'2rem', boxShadow:'0 2px 16px rgba(0,0,0,0.09)' },
  title: { color:'#333', marginTop:0 },
  ville: { color:'#8B5E2A', fontWeight:'600', marginBottom:'0.5rem' },
  desc: { color:'#555', lineHeight:1.6 },
  infos: { display:'flex', gap:'1.5rem', flexWrap:'wrap', marginTop:'1rem' },
  prix: { color:'#27ae60', fontWeight:'700' },
  formTitle: { color:'#8B5E2A', marginBottom:'1rem' },
  form: { display:'flex', flexDirection:'column', gap:'0.75rem' },
  label: { fontWeight:'600', color:'#555', fontSize:'0.9rem' },
  input: { padding:'0.75rem', borderRadius:'8px', border:'1px solid #ddd', fontSize:'1rem', fontFamily:'inherit' },
  btn: { padding:'0.85rem', background:'#8B5E2A', color:'white', border:'none', borderRadius:'8px', fontSize:'1rem', cursor:'pointer', marginTop:'0.5rem' },
  error: { color:'#c0392b', fontSize:'0.9rem' },
  success: { background:'#eafaf1', color:'#1e8449', padding:'1.25rem', borderRadius:'8px', fontWeight:'600' },
  loading: { padding:'3rem', textAlign:'center' }
}