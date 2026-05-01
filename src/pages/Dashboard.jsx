import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import './Dashboard.css'

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

  function getStatusBadge(status) {
    switch(status) {
      case 'confirmé': return <span className="badge badge-success">Confirmé</span>;
      case 'en_attente': return <span className="badge badge-warning">En attente</span>;
      case 'annulé': return <span className="badge badge-error">Annulé</span>;
      default: return <span className="badge">{status}</span>;
    }
  }

  if (loading) return (
    <div className="page-container" style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
      <div className="loading-spinner">Chargement de votre espace...</div>
    </div>
  )

  return (
    <div className="page-container animate-fade-in">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Mes visites</h1>
        <p className="dashboard-subtitle">Suivez vos demandes de visite en cours</p>
      </div>

      {visites.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--color-text-muted)', marginBottom: '1rem'}}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <p>Vous n'avez pas encore demandé de visite.</p>
        </div>
      ) : (
        <div className="visites-list">
          {visites.map(v => (
            <div key={v.id} className="card visite-card">
              <div className="visite-card-top">
                <div className="visite-info">
                  <h3 className="visite-maison">{v.maisons?.titre}</h3>
                  <div className="visite-location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {v.maisons?.ville} &mdash; {v.maisons?.adresse}
                  </div>
                </div>
                <div className="visite-status">
                  {getStatusBadge(v.statut)}
                </div>
              </div>
              
              <div className="visite-meta">
                <div className="meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {new Date(v.date_visite).toLocaleString('fr-DZ', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </div>
                <div className="meta-item price-item">
                  {v.maisons?.prix?.toLocaleString()} DA / mois
                </div>
              </div>
              
              {v.message && (
                <div className="visite-message">
                  <span className="message-label">Votre message :</span>
                  <p>"{v.message}"</p>
                </div>
              )}
              
              {v.scan_cin_url && (
                <div className="visite-actions">
                  <a href={v.scan_cin_url} target="_blank" rel="noreferrer" className="btn btn-outline" style={{padding: '0.4rem 0.8rem', fontSize: '0.85rem'}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Voir mon document CIN
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}