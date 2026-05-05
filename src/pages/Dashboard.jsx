import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link } from 'react-router-dom'
import './Dashboard.css'

export default function Dashboard() {
  const [visites, setVisites] = useState([])
  const [receivedVisites, setReceivedVisites] = useState([])
  const [mesAnnonces, setMesAnnonces] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('sent') // 'sent', 'received', or 'annonces'

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // 1. Demandes envoyées par l'utilisateur
    const { data: sent, error: errorSent } = await supabase.from('visites')
      .select('*, maisons!inner(id, titre, ville, adresse, prix, surface, chambres, sdb, type_bien, type_transaction)')
      .eq('locataire_id', user.id)
      .order('created_at', { ascending: false })
    
    if (errorSent) {
      console.error("Erreur lors du chargement des demandes envoyées:", errorSent)
      // Si l'erreur est liée au join, on essaie sans le join pour au moins avoir les données brutes
      const { data: fallbackSent } = await supabase.from('visites')
        .select('*')
        .eq('locataire_id', user.id)
      setVisites(fallbackSent || [])
    } else {
      setVisites(sent || [])
    }

    // 2. Demandes reçues pour ses propres biens
    const { data: received, error: errorReceived } = await supabase.from('visites')
      .select('*, maisons!inner(titre, ville, adresse, prix, proprietaire_id)')
      .eq('maisons.proprietaire_id', user.id)
      .order('created_at', { ascending: false })

    if (errorReceived) console.error("Erreur lors du chargement des demandes reçues:", errorReceived)
    setReceivedVisites(received || [])

    // 3. Mes annonces publiées
    const { data: annonces, error: errorAnnonces } = await supabase.from('maisons')
      .select('*')
      .eq('proprietaire_id', user.id)
      .order('created_at', { ascending: false })
    
    if (errorAnnonces) console.error("Erreur lors du chargement de mes annonces:", errorAnnonces)
    setMesAnnonces(annonces || [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  async function updateStatus(visiteId, newStatus) {
    const { error } = await supabase
      .from('visites')
      .update({ statut: newStatus })
      .eq('id', visiteId)
    
    if (error) alert(error.message)
    else loadData() // Recharger les données
  }

  async function deleteAnnonce(id) {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) return

    const { error } = await supabase
      .from('maisons')
      .delete()
      .eq('id', id)
    
    if (error) {
      alert("Erreur lors de la suppression : " + error.message)
    } else {
      setMesAnnonces(prev => prev.filter(m => m.id !== id))
    }
  }

  async function deleteVisite(id) {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) return

    const { error } = await supabase
      .from('visites')
      .delete()
      .eq('id', id)
    
    if (error) {
      alert("Erreur lors de la suppression : " + error.message)
    } else {
      setVisites(prev => prev.filter(v => v.id !== id))
    }
  }

  function getStatusBadge(status) {
    const labels = {
      'en_attente': 'En attente',
      'confirmé': 'Confirmé',
      'annulé': 'Annulé'
    }
    return <span className={`status-badge status-${status}`}>{labels[status] || status}</span>
  }

  if (loading) return (
    <div className="dashboard-container">
      <div className="dashboard-content" style={{textAlign:'center', paddingTop: '100px'}}>
        <div className="loading-spinner">Chargement de votre espace personnel...</div>
      </div>
    </div>
  )

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Tableau de bord</h1>
          <p className="dashboard-subtitle">Gérez vos activités et vos biens immobiliers.</p>
        </header>

        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            Mes demandes ({visites.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'received' ? 'active' : ''}`}
            onClick={() => setActiveTab('received')}
          >
            Réponses reçues ({receivedVisites.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'annonces' ? 'active' : ''}`}
            onClick={() => setActiveTab('annonces')}
          >
            Mes annonces ({mesAnnonces.length})
          </button>
        </div>

        {/* --- Contenu : Mes Demandes (Envoyées) --- */}
        {activeTab === 'sent' && (
          visites.length === 0 ? (
            <div className="empty-container">
              <div className="empty-icon-circle">🏠</div>
              <h3 className="empty-title">Aucune demande envoyée</h3>
              <p className="empty-text">Vous n'avez pas encore envoyé de demande de visite.</p>
            </div>
          ) : (
            <div className="visites-grid">
              {visites.map(v => (
                <div key={v.id} className="visite-card">
                  <div className="visite-card-header">
                    <div className="visite-main-info">
                      <h3>{v.maisons?.titre}</h3>
                      <div className="visite-location">{v.maisons?.ville}</div>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
                      {getStatusBadge(v.statut)}
                      <button 
                        onClick={() => deleteVisite(v.id)}
                        className="btn-delete-icon"
                        title="Supprimer la demande"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="visite-details-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))'}}>
                    <div className="detail-item">
                      <span className="detail-label">Date prévue</span>
                      <span className="detail-value">{new Date(v.date_visite).toLocaleString()}</span>
                    </div>
                    {v.maisons ? (
                      <>
                        <div className="detail-item">
                          <span className="detail-label">Prix</span>
                          <span className="detail-value">{v.maisons.prix?.toLocaleString() || '--'} DA</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Surface</span>
                          <span className="detail-value">{v.maisons.surface || '--'} m²</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Type</span>
                          <span className="detail-value" style={{textTransform:'capitalize'}}>{v.maisons.type_bien || 'Bien'}</span>
                        </div>
                      </>
                    ) : (
                      <div className="detail-item">
                        <span className="detail-label">Statut</span>
                        <span className="detail-value" style={{fontSize:'0.9rem', color:'var(--primary)'}}>En attente</span>
                      </div>
                    )}
                  </div>
                  {v.message && (
                    <div className="visite-message-box" style={{marginTop:'1rem', marginBottom:'1.5rem', background:'#f8fafc', border:'1px solid #e2e8f0'}}>
                      <div className="message-header">VOTRE MESSAGE</div>
                      <p className="message-text">"{v.message}"</p>
                    </div>
                  )}
                  <div className="visite-footer">
                    <Link to={`/maison/${v.maison_id}`} className="btn-doc" style={{width:'100%', justifyContent:'center'}}>
                      Voir les détails du bien
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* --- Contenu : Réponses reçues (Demandes sur mes annonces) --- */}
        {activeTab === 'received' && (
          receivedVisites.length === 0 ? (
            <div className="empty-container">
              <div className="empty-icon-circle">🔔</div>
              <h3 className="empty-title">Aucune réponse</h3>
              <p className="empty-text">Les demandes pour vos biens apparaîtront ici dès qu'un utilisateur sera intéressé.</p>
            </div>
          ) : (
            <div className="visites-grid">
              {receivedVisites.map(v => (
                <div key={v.id} className="visite-card">
                  <div className="visite-card-header">
                    <div className="visite-main-info">
                      <h3>{v.maisons?.titre}</h3>
                      <div className="visite-location">{v.maisons?.ville}</div>
                    </div>
                    {getStatusBadge(v.statut)}
                  </div>
                  <div className="visite-message-box">
                    <div className="message-header">MESSAGE DU CLIENT</div>
                    <p className="message-text">"{v.message}"</p>
                  </div>
                  <div className="visite-details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Date proposée</span>
                      <span className="detail-value">{new Date(v.date_visite).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="visite-footer" style={{flexDirection:'column', alignItems:'stretch', gap:'1rem'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <span className="creation-date">Reçu le {new Date(v.created_at).toLocaleDateString()}</span>
                      {v.scan_cin_url && <a href={v.scan_cin_url} target="_blank" className="btn-doc">Voir le CIN</a>}
                    </div>
                    
                    {v.statut === 'en_attente' && (
                      <div className="visite-actions-btns" style={{display:'flex', gap:'1rem', marginTop:'0.5rem'}}>
                        <button 
                          onClick={() => updateStatus(v.id, 'confirmé')}
                          className="btn btn-primary" style={{flex:1, background: '#10b981', borderColor:'#10b981'}}>
                          Accepter la visite
                        </button>
                        <button 
                          onClick={() => updateStatus(v.id, 'annulé')}
                          className="btn btn-outline" style={{flex:1, color:'#ef4444', borderColor:'#ef4444'}}>
                          Refuser
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* --- Contenu : Mes Annonces --- */}
        {activeTab === 'annonces' && (
          mesAnnonces.length === 0 ? (
            <div className="empty-container">
              <div className="empty-icon-circle">🏗️</div>
              <h3 className="empty-title">Aucune annonce</h3>
              <p className="empty-text">Vous n'avez pas encore publié d'annonce immobilière.</p>
              <Link to="/publier" className="btn btn-primary" style={{marginTop:'1rem'}}>Publier ma première annonce</Link>
            </div>
          ) : (
            <div className="visites-grid">
              {mesAnnonces.map(m => (
                <div key={m.id} className="visite-card">
                  <div className="visite-card-header">
                    <div className="visite-main-info">
                      <h3>{m.titre}</h3>
                      <div className="visite-location">{m.ville} &mdash; {m.adresse}</div>
                    </div>
                    <span className="status-badge" style={{background: '#e2e8f0', color: '#475569'}}>
                      {m.type_transaction === 'location' ? 'À Louer' : 'À Vendre'}
                    </span>
                  </div>
                  <div className="visite-details-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))'}}>
                    <div className="detail-item">
                      <span className="detail-label">Prix</span>
                      <span className="detail-value">{m.prix?.toLocaleString()} DA</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Surface</span>
                      <span className="detail-value">{m.surface} m²</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Type</span>
                      <span className="detail-value" style={{textTransform:'capitalize'}}>{m.type_bien || 'Bien'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Chambres</span>
                      <span className="detail-value">{m.chambres || 0}</span>
                    </div>
                  </div>
                  <div className="visite-footer" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span className="creation-date">Publié le {new Date(m.created_at).toLocaleDateString()}</span>
                    <div style={{display:'flex', gap:'0.8rem'}}>
                      <Link to={`/maison/${m.id}`} className="btn-doc">Voir l'annonce</Link>
                      <button 
                        onClick={() => deleteAnnonce(m.id)}
                        className="btn-delete"
                        title="Supprimer cette annonce"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}