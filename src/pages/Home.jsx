import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  const [maisons, setMaisons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('maisons').select('*').eq('disponible', true)
      .then(({ data }) => { setMaisons(data || []); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="page-container" style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
      <div className="loading-spinner">Chargement des maisons...</div>
    </div>
  )

  return (
    <div className="page-container animate-fade-in">
      <div className="home-header">
        <h1 className="home-title">Découvrez votre prochaine maison</h1>
        <p className="home-subtitle">Les meilleures offres immobilières sélectionnées pour vous</p>
      </div>

      <div className="property-grid">
        {maisons.map(m => (
          <Link to={`/maison/${m.id}`} key={m.id} className="card property-card">
            <div className="property-image-container">
              {m.image_url ? (
                <div className="property-image" style={{backgroundImage: `url(${m.image_url})`}} />
              ) : (
                <div className="property-image placeholder-bg" />
              )}
              <div className="property-price-badge">
                {m.prix?.toLocaleString()} DA <span className="price-period">/ mois</span>
              </div>
            </div>
            
            <div className="property-content">
              <h3 className="property-title">{m.titre}</h3>
              <div className="property-location">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {m.ville}
              </div>
              <p className="property-address">{m.adresse}</p>
            </div>
          </Link>
        ))}
        {maisons.length === 0 && (
          <div className="empty-state">
            <p>Aucune maison disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}