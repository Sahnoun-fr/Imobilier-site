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
    <div className="page-container maison-page">
      <div className="maison-layout">
        <div className="maison-main">
          <div className="maison-gallery">
            {maison.image_url ? (
              <img src={maison.image_url} alt={maison.titre} className="maison-hero-img" />
            ) : (
              <div className="maison-hero-img placeholder-bg">
                <span>Aucune image disponible</span>
              </div>
            )}
            <div className="maison-badges">
              <span className="badge badge-disponible">Disponible</span>
              <span className="badge badge-type">{maison.type_transaction === 'location' ? 'À Louer' : 'À Vendre'}</span>
            </div>
          </div>
          
          <div className="maison-content-card">
            <div className="maison-header">
              <div className="title-group">
                <h1 className="maison-title">{maison.titre}</h1>
                <div className="maison-location">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {maison.ville} &mdash; {maison.adresse}
                </div>
              </div>
              <div className="maison-price-tag">
                <span className="price-value">{maison.prix?.toLocaleString()} DA</span>
                {maison.type_transaction === 'location' && <span className="price-period">/ mois</span>}
              </div>
            </div>

            <div className="maison-features">
              <div className="feature-item">
                <span className="feature-icon">🏠</span>
                <span className="feature-text">{maison.surface || '--'} m²</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🛏️</span>
                <span className="feature-text">{maison.chambres || '--'} Chambres</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🚿</span>
                <span className="feature-text">{maison.sdb || '--'} SdB</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📍</span>
                <span className="feature-text">{maison.ville}</span>
              </div>
            </div>
            
            <div className="maison-description-section">
              <h2 className="section-title-small">À propos de ce bien</h2>
              <p className="maison-desc">{maison.description}</p>
            </div>

            <div className="maison-amenities">
              <h2 className="section-title-small">Équipements</h2>
              <div className="amenities-grid">
                <div className="amenity-item"><span className="check">✓</span> Wifi</div>
                <div className="amenity-item"><span className="check">✓</span> Parking</div>
                <div className="amenity-item"><span className="check">✓</span> Climatisation</div>
                <div className="amenity-item"><span className="check">✓</span> Cuisine équipée</div>
              </div>
            </div>
          </div>
        </div>

        <div className="maison-sidebar">
          <div className="booking-card sticky-sidebar">
            {success ? (
              <div className="booking-success">
                <div className="success-icon-wrapper">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3>Demande envoyée !</h3>
                <p>Le propriétaire a été notifié. Vous recevrez une réponse prochainement dans votre tableau de bord.</p>
                <Link to="/dashboard" className="btn btn-secondary btn-block">Aller au tableau de bord</Link>
              </div>
            ) : (
              <>
                <h3 className="booking-title">Demander une visite</h3>
                <p className="booking-subtitle">Planifiez un rendez-vous pour visiter ce bien.</p>
                
                <form onSubmit={handleReserver} className="booking-form">
                  <div className="form-group">
                    <label className="form-label">Date et heure souhaitée</label>
                    <div className="input-with-icon">
                      <input className="form-input" type="datetime-local"
                        value={date} onChange={e => setDate(e.target.value)} required />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Message au propriétaire</label>
                    <textarea className="form-input" style={{resize:'vertical', minHeight:'120px'}}
                      placeholder="Ex: Bonjour, je suis intéressé par votre bien..." value={message}
                      onChange={e => setMessage(e.target.value)} />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Pièce d'identité (Scan CIN/Passeport)</label>
                    <div className="file-upload-container">
                      <input type="file" accept="image/*,.pdf" className="file-hidden-input"
                        onChange={e => setFile(e.target.files[0])} required id="file-upload" />
                      <label htmlFor="file-upload" className={`file-upload-box ${file ? 'file-selected' : ''}`}>
                        <div className="upload-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                        </div>
                        <span className="upload-text">{file ? file.name : "Cliquez pour uploader"}</span>
                      </label>
                    </div>
                  </div>
                  
                  {error && <div className="error-alert">{error}</div>}
                  
                  <button className="btn-confirm-booking" type="submit" disabled={loading}>
                    {loading ? (
                      <span className="loader-inline">Traitement...</span>
                    ) : 'Confirmer la demande'}
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