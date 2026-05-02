import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './Maison.css'

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
        .from('cin-files').upload(fileName, file)
      if (uploadError) { setError("Erreur upload: " + uploadError.message); setLoading(false); return }
      const { data: urlData } = supabase.storage.from('cin-files').getPublicUrl(fileName)
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

  if (!maison) return (
    <div className="page-container" style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
      <div className="loading-spinner">Chargement...</div>
    </div>
  )

  return (
    <div className="page-container animate-fade-in">
      <div className="maison-layout">
        <div className="maison-details">
          {maison.image_url ? (
            <img src={maison.image_url} alt={maison.titre} className="maison-hero-img" />
          ) : (
            <div className="maison-hero-img placeholder-bg" />
          )}
          
          <div className="maison-info-card card">
            <div className="maison-header">
              <h1 className="maison-title">{maison.titre}</h1>
              <div className="maison-price">
                {maison.prix?.toLocaleString()} DA <span>/ mois</span>
              </div>
            </div>
            
            <div className="property-location maison-location">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {maison.ville} &mdash; {maison.adresse}
            </div>
            
            <div className="maison-description-section">
              <h3>À propos de ce bien</h3>
              <p className="maison-desc">{maison.description}</p>
            </div>
          </div>
        </div>

        <div className="maison-sidebar">
          <div className="card booking-card sticky-sidebar">
            {success ? (
              <div className="booking-success">
                <div className="success-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3>Visite demandée avec succès !</h3>
                <p>Vous pouvez suivre votre demande dans votre tableau de bord.</p>
              </div>
            ) : (
              <>
                <h3 className="booking-title">Demander une visite</h3>
                <form onSubmit={handleReserver} className="booking-form">
                  <div className="form-group">
                    <label className="form-label">Date souhaitée</label>
                    <input className="form-input" type="datetime-local"
                      value={date} onChange={e => setDate(e.target.value)} required />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Message (optionnel)</label>
                    <textarea className="form-input" style={{resize:'vertical', minHeight:'100px'}}
                      placeholder="Votre message pour le propriétaire..." value={message}
                      onChange={e => setMessage(e.target.value)} />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Scan de votre CIN (obligatoire)</label>
                    <div className="file-upload-wrapper">
                      <input type="file" accept="image/*,.pdf" className="file-input"
                        onChange={e => setFile(e.target.files[0])} required id="file-upload" />
                      <label htmlFor="file-upload" className="file-upload-label">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        {file ? file.name : "Choisir un fichier"}
                      </label>
                    </div>
                  </div>
                  
                  {error && <div className="error-message">{error}</div>}
                  
                  <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                    {loading ? 'Envoi en cours...' : 'Confirmer la demande'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}