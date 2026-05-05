import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './Maison.css'

export default function Maison() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [maison, setMaison] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isOwner, setIsOwner] = useState(false)
  const [sessionUser, setSessionUser] = useState(null)
  const [houseVisits, setHouseVisits] = useState([])

  useEffect(() => {
    async function fetchData() {
      const { data, error: fetchError } = await supabase.from('maisons').select('*').eq('id', id).single()
      
      if (fetchError) {
        setError("Ce bien n'existe pas ou a été supprimé.")
        return
      }

      setMaison(data)
      
      if (data) {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        setSessionUser(authUser)
        if (authUser && authUser.id === data.proprietaire_id) {
          setIsOwner(true)
        }
      }
    }
    fetchData()
  }, [id])

  async function fetchHouseVisits() {
    const { data } = await supabase.from('visites')
      .select('*')
      .eq('maison_id', id)
      .order('created_at', { ascending: false })
    setHouseVisits(data || [])
  }

  useEffect(() => {
    if (isOwner) fetchHouseVisits()
  }, [isOwner])

  async function updateVisiteStatus(visiteId, newStatus) {
    const { error } = await supabase.from('visites').update({ statut: newStatus }).eq('id', visiteId)
    if (error) alert(error.message)
    else fetchHouseVisits()
  }

  async function handleDelete() {
    if (!window.confirm("Voulez-vous vraiment supprimer cette annonce ? Cette action est irréversible.")) return
    
    setLoading(true)
    const { error } = await supabase.from('maisons').delete().eq('id', id)
    
    if (error) {
      setError("Erreur lors de la suppression: " + error.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  async function handleReserver(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError("Vous devez être connecté pour demander une visite.")
      setLoading(false)
      return
    }

    const formData = new FormData(e.target)
    const date_visite = formData.get('date_visite')
    const message = formData.get('message')

    const { error: insertError } = await supabase.from('visites').insert({
      locataire_id: user.id,
      maison_id: id,
      date_visite,
      message,
      statut: 'en_attente'
    })

    if (insertError) {
      setError(insertError.message)
    } else {
      setSuccess(true)
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    }
    setLoading(false)
  }

  if (error && !maison) return (
    <div className="maison-page">
      <div className="maison-content-card card" style={{textAlign:'center', padding:'4rem', maxWidth:'600px', margin:'0 auto'}}>
        <h2 style={{color:'var(--danger)'}}>Oups !</h2>
        <p>{error}</p>
        <Link to="/" className="btn btn-primary" style={{marginTop:'2rem', display:'inline-block'}}>Retour à l'accueil</Link>
      </div>
    </div>
  )

  if (!maison) return <div className="loading">Chargement du bien...</div>

  return (
    <div className="maison-page animate-fade-in">
      <div className="maison-layout">
        <div className="maison-main">
          {/* Galerie d'images */}
          <div className="maison-gallery">
            <img src={maison.image_url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'} alt={maison.titre} className="maison-hero-img" />
            <div className="maison-badges">
              <span className="badge badge-disponible">Disponible</span>
              <span className="badge badge-type">{maison.type_transaction === 'location' ? 'À Louer' : 'À Vendre'}</span>
            </div>
          </div>

          <div className="maison-content-card">
            <header className="maison-header">
              <div className="title-group">
                <h1 className="maison-title">{maison.titre}</h1>
                <p className="maison-location">📍 {maison.adresse}, {maison.ville}</p>
              </div>
              <div className="maison-price-tag">
                <span className="price-value">{maison.prix?.toLocaleString()} DA</span>
                <span className="price-period">{maison.type_transaction === 'location' ? 'Par mois' : 'Prix total'}</span>
              </div>
            </header>

            {/* Caractéristiques */}
            <div className="maison-features">
              <div className="feature-item">
                <span className="feature-icon">🏠</span>
                <span className="feature-text">{maison.surface || '--'} m²</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🛏️</span>
                <span className="feature-text">{maison.chambres || 0} Ch.</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🚿</span>
                <span className="feature-text">{maison.sdb || 0} Sdb.</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📍</span>
                <span className="feature-text">{maison.ville}</span>
              </div>
            </div>

            <h2 className="section-title-small">Description</h2>
            <p className="maison-desc">{maison.description}</p>

            <h2 className="section-title-small">Équipements</h2>
            <div className="amenities-grid">
              <div className="amenity-item"><span className="check">✓</span> Parking</div>
              <div className="amenity-item"><span className="check">✓</span> Climatisation</div>
              <div className="amenity-item"><span className="check">✓</span> Sécurité 24/7</div>
              <div className="amenity-item"><span className="check">✓</span> Proche transport</div>
            </div>
          </div>
        </div>

        <div className="maison-sidebar">
          <div className="sticky-sidebar">
            <div className="booking-card">
              {isOwner ? (
                <div className="owner-management">
                  <h3 className="booking-title">Gestion de l'annonce</h3>
                  <p className="booking-subtitle">Vous êtes le propriétaire de ce bien.</p>
                  
                  <div className="owner-actions" style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                    <button 
                      onClick={handleDelete}
                      className="btn-delete-full"
                      disabled={loading}
                    >
                      {loading ? 'Suppression...' : '🗑️ Supprimer l\'annonce'}
                    </button>
                  </div>

                  {houseVisits.length > 0 && (
                    <div className="house-visits-list" style={{marginTop:'2.5rem', borderTop:'1px solid var(--border)', paddingTop:'1.5rem'}}>
                      <h4 style={{fontSize:'1rem', fontWeight:700, marginBottom:'1rem'}}>Demandes de visite ({houseVisits.length})</h4>
                      <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                        {houseVisits.map(v => (
                          <div key={v.id} style={{padding:'1rem', background:'#f8fafc', borderRadius:'10px', fontSize:'0.9rem', border:'1px solid #e2e8f0'}}>
                            <div style={{fontWeight:600, marginBottom:'0.3rem'}}>
                              {new Date(v.date_visite).toLocaleDateString()}
                            </div>
                            <p style={{fontStyle:'italic', color:'#64748b', marginBottom:'0.8rem'}}>"{v.message}"</p>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                              <span className={`status-badge status-${v.statut}`} style={{fontSize:'0.7rem', padding:'0.3rem 0.6rem'}}>
                                {v.statut}
                              </span>
                              {v.statut === 'en_attente' && (
                                <div style={{display:'flex', gap:'0.5rem'}}>
                                  <button onClick={() => updateVisiteStatus(v.id, 'confirmé')} style={{padding:'2px 8px', borderRadius:'4px', background:'#10b981', color:'white', border:'none', cursor:'pointer'}}>✓</button>
                                  <button onClick={() => updateVisiteStatus(v.id, 'annulé')} style={{padding:'2px 8px', borderRadius:'4px', background:'#ef4444', color:'white', border:'none', cursor:'pointer'}}>✕</button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : success ? (
                <div className="booking-success">
                  <div className="success-icon-wrapper">✨</div>
                  <h3>Demande envoyée !</h3>
                  <p>Le propriétaire a été notifié. Vous pouvez suivre l'état de votre demande dans votre tableau de bord.</p>
                  <Link to="/dashboard" className="btn btn-primary" style={{display:'inline-block', padding:'1rem 2rem', borderRadius:'50px', textDecoration:'none'}}>Voir mon tableau de bord</Link>
                </div>
              ) : (
                <>
                  <h3 className="booking-title">Demander une visite</h3>
                  <p className="booking-subtitle">Planifiez un rendez-vous pour visiter ce bien.</p>
                  
                  <form onSubmit={handleReserver} className="booking-form" style={{position:'relative'}}>
                    {!sessionUser && (
                      <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                        background: 'rgba(255,255,255,0.9)', zIndex: 10,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', 
                        justifyContent: 'center', textAlign: 'center', padding: '1rem',
                        borderRadius: '1rem'
                      }}>
                        <p style={{fontWeight:600, color:'var(--secondary)', marginBottom:'1rem'}}>
                          Connectez-vous pour envoyer une demande.
                        </p>
                        <Link to="/login" className="btn btn-primary">Se connecter</Link>
                      </div>
                    )}
                    
                    <div className="form-group">
                      <label className="form-label">Date souhaitée</label>
                      <input type="datetime-local" name="date_visite" required className="form-input" />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Message</label>
                      <textarea name="message" placeholder="Bonjour, je suis intéressé..." className="form-input" style={{minHeight:'100px'}}></textarea>
                    </div>

                    {error && <div className="error-alert">{error}</div>}

                    <button type="submit" disabled={loading} className="btn-confirm-booking">
                      {loading ? 'Envoi...' : 'Réserver la visite'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}