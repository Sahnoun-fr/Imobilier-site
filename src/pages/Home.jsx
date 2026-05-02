import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link, useLocation } from 'react-router-dom'
import './Home.css'

export default function Home() {
  const [maisons, setMaisons] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ transaction: '', ville: '', budget: '' })
  
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const navbarQuery = queryParams.get('q')

  useEffect(() => {
    fetchMaisons()
  }, [navbarQuery]) // Refaire la recherche quand le mot-clé change

  async function fetchMaisons() {
    setLoading(true)
    let query = supabase.from('maisons').select('*').eq('disponible', true)
    
    // Si une recherche vient de la navbar
    if (navbarQuery) {
      query = query.or(`titre.ilike.%${navbarQuery}%,ville.ilike.%${navbarQuery}%`)
    } else {
      // Sinon on applique les filtres de la page d'accueil
      if (filters.transaction) query = query.eq('type_transaction', filters.transaction)
      if (filters.ville) query = query.ilike('ville', `%${filters.ville}%`)
      if (filters.budget) {
        const budgetVal = parseInt(filters.budget)
        if (!isNaN(budgetVal)) query = query.lte('prix', budgetVal)
      }
    }

    const { data } = await query.order('created_at', { ascending: false }).limit(6)
    setMaisons(data || [])
    setLoading(false)
  }

  function handleSearch() {
    fetchMaisons()
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Trouvez la maison de vos rêves avec Dar Connect</h1>
          <p className="hero-subtitle">Votre plateforme de confiance pour l'immobilier en Algérie. Découvrez les meilleures offres de location et de vente.</p>
          
          <div className="hero-search advanced-search">
            <div className="search-field">
              <label>Transaction</label>
              <select value={filters.transaction} onChange={e => setFilters({...filters, transaction: e.target.value})}>
                <option value="">Tout type</option>
                <option value="location">Location</option>
                <option value="vente">Vente</option>
              </select>
            </div>
            <div className="search-divider"></div>
            <div className="search-field">
              <label>Localisation</label>
              <input 
                type="text" 
                placeholder="Ville, quartier..." 
                value={filters.ville} 
                onChange={e => setFilters({...filters, ville: e.target.value})}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="search-divider"></div>
            <div className="search-field">
              <label>Budget Max</label>
              <select value={filters.budget} onChange={e => setFilters({...filters, budget: e.target.value})}>
                <option value="">Pas de limite</option>
                <option value="50000">50 000 DA</option>
                <option value="100000">100 000 DA</option>
                <option value="500000">500 000 DA</option>
                <option value="1000000">1 000 000 DA</option>
              </select>
            </div>
            <button className="search-btn" onClick={handleSearch}>Rechercher</button>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="categories-section">
        <div className="categories-grid">
          <Link to="/categorie/appartement" className="category-item">
            <div className="category-icon">🏢</div>
            <span>Appartements</span>
          </Link>
          <Link to="/categorie/villa" className="category-item">
            <div className="category-icon">🏡</div>
            <span>Villas</span>
          </Link>
          <Link to="/categorie/studio" className="category-item">
            <div className="category-icon">🛏️</div>
            <span>Studios</span>
          </Link>
          <Link to="/categorie/terrain" className="category-item">
            <div className="category-icon">🌳</div>
            <span>Terrains</span>
          </Link>
          <Link to="/categorie/local-pro" className="category-item">
            <div className="category-icon">💼</div>
            <span>Locaux Pro</span>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🏠</div>
            <h3 className="feature-title">Vaste Choix</h3>
            <p className="feature-desc">Des centaines de propriétés vérifiées mises à jour quotidiennement.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">Sécurité Garantie</h3>
            <p className="feature-desc">Vos transactions et données sont protégées sur notre plateforme.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3 className="feature-title">Accompagnement</h3>
            <p className="feature-desc">Notre équipe est là pour vous assister à chaque étape.</p>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="properties-section">
        <div className="section-header">
          <h2 className="section-title">Nos Dernières Offres</h2>
          <p className="section-subtitle">Découvrez les propriétés récemment ajoutées à notre catalogue.</p>
        </div>

        {loading ? (
          <div className="loading-state">Recherche des meilleures propriétés...</div>
        ) : (
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
            {maisons.length === 0 && <p style={{textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)'}}>Aucune maison disponible pour le moment.</p>}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Vous êtes propriétaire ?</h2>
          <p>Mettez votre bien en ligne sur Dar Connect et touchez des milliers de locataires et d'acheteurs potentiels chaque jour.</p>
          <Link to="/register" className="cta-button">Publier une annonce gratuite</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>Dar Connect</h3>
            <p>La référence de l'immobilier en Algérie. Trouvez, louez, ou vendez votre bien en toute sécurité.</p>
          </div>
          <div className="footer-links">
            <h4>Liens Rapides</h4>
            <ul>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/about">À propos</Link></li>
              <li><Link to="/register">S'inscrire</Link></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Contact</h4>
            <p>📧 contact@darconnect.dz</p>
            <p>📞 +213 555 00 00 00</p>
            <p>📍 Alger, Algérie</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Dar Connect. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}