import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './Category.css'

export default function Category() {
  const { type } = useParams()
  const [maisons, setMaisons] = useState([])
  const [loading, setLoading] = useState(true)

  // Formatter le type pour l'affichage (ex: "appartement" -> "Appartements")
  const formatTitle = (t) => {
    if (!t) return "Biens"
    let capitalized = t.charAt(0).toUpperCase() + t.slice(1)
    if (!capitalized.endsWith('s') && t !== 'local-pro') {
      capitalized += 's'
    }
    if (t === 'local-pro') return "Locaux Professionnels"
    return capitalized
  }

  useEffect(() => {
    setLoading(true)
    // On suppose que la colonne s'appelle 'type' dans Supabase
    // Si la colonne n'existe pas encore, cette requête ne renverra rien ou une erreur (qu'on gère silencieusement ici)
    supabase.from('maisons').select('*').eq('disponible', true).eq('type', type)
      .then(({ data, error }) => { 
        if (error) {
          console.error("Erreur Supabase (peut-être que la colonne 'type' n'existe pas encore) :", error)
        }
        setMaisons(data || [])
        setLoading(false) 
      })
  }, [type])

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>{formatTitle(type)}</h1>
        <p>Découvrez notre sélection exclusive de {type?.replace('-', ' ')}s.</p>
      </div>

      <div className="category-content">
        {loading ? (
          <div className="loading-state">Recherche en cours...</div>
        ) : (
          <>
            <p className="results-count">
              {maisons.length} {maisons.length > 1 ? 'résultats trouvés' : 'résultat trouvé'}
            </p>

            <div className="properties-grid">
              {maisons.map(m => (
                <Link to={`/maison/${m.id}`} key={m.id} className="property-card">
                  <div className="property-image-wrapper">
                    {m.image_url ? (
                      <img src={m.image_url} alt={m.titre} className="property-image" />
                    ) : (
                      <div className="property-image" style={{backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8'}}>Aucune image</div>
                    )}
                    <div className="property-badge">Disponible</div>
                  </div>
                  
                  <div className="property-content">
                    <div className="property-price">{m.prix?.toLocaleString()} DA <span style={{fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal'}}>/ mois</span></div>
                    <h3 className="property-title">{m.titre}</h3>
                    <div className="property-location">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      {m.ville}, {m.adresse}
                    </div>
                    <div className="property-footer">
                      <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Voir les détails</span>
                      <button className="property-btn">→</button>
                    </div>
                  </div>
                </Link>
              ))}
              
              {maisons.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3>Aucun bien trouvé</h3>
                  <p>Nous n'avons pas encore de biens dans cette catégorie, ou la colonne "type" n'a pas encore été configurée dans votre base de données.</p>
                  <Link to="/" className="back-home-btn">Retour à l'accueil</Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
