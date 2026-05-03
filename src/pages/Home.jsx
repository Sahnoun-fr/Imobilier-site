import { useEffect, useState, useRef } from 'react'

import { supabase } from '../supabaseClient'
import { Link, useLocation } from 'react-router-dom'
import './Home.css'

export default function Home() {
  const [maisons, setMaisons] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ 
    transaction: '', 
    ville: '', 
    budget: '',
    type_bien: '',
    keyword: ''
  })

  
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const navbarQuery = queryParams.get('q')

  const resultsRef = useRef(null)


  useEffect(() => {
    fetchMaisons()
  }, [navbarQuery]) // Refaire la recherche quand le mot-clé change

  async function fetchMaisons(shouldScroll = false) {
    setLoading(true)
    let query = supabase.from('maisons').select('*').eq('disponible', true)
    
    // On fusionne le mot-clé de la navbar avec les filtres s'il existe
    const activeKeyword = filters.keyword || navbarQuery
    
    if (activeKeyword) {
      query = query.or(`titre.ilike.%${activeKeyword}%,description.ilike.%${activeKeyword}%,ville.ilike.%${activeKeyword}%`)
    }

    // On applique les autres filtres
    if (filters.transaction) query = query.eq('type_transaction', filters.transaction)
    if (filters.ville) query = query.ilike('ville', `%${filters.ville}%`)
    if (filters.type_bien) query = query.ilike('titre', `%${filters.type_bien}%`)
    
    if (filters.budget) {
      const budgetVal = parseInt(filters.budget)
      if (!isNaN(budgetVal)) query = query.lte('prix', budgetVal)
    }

    const { data } = await query.order('created_at', { ascending: false })
    setMaisons(data || [])
    setLoading(false)

    if (shouldScroll && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }


  function handleSearch() {
    fetchMaisons(true)
  }


  function handleReset() {
    setFilters({
      transaction: '',
      ville: '',
      budget: '',
      type_bien: '',
      keyword: ''
    })
    // On relance la recherche sans filtres
    setTimeout(() => fetchMaisons(), 0)
  }


  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Trouvez la maison de vos rêves avec MaisonCllique</h1>

          <p className="hero-subtitle">Votre plateforme de confiance pour l'immobilier en Algérie. Découvrez les meilleures offres de location et de vente.</p>
          
          <div className="hero-search-wrapper">
            <div className="hero-search advanced-search">
              <div className="search-field keyword-field">
                <div className="field-label-group">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <label>Recherche</label>
                </div>
                <input 
                  type="text" 
                  placeholder="Appartement, calme..." 
                  value={filters.keyword} 
                  onChange={e => setFilters({...filters, keyword: e.target.value})}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="search-divider"></div>
              <div className="search-field">
                <div className="field-label-group">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11V7a5 5 0 0 1 10 0v4"></path><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M12 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path></svg>
                  <label>Transaction</label>
                </div>
                <select value={filters.transaction} onChange={e => setFilters({...filters, transaction: e.target.value})}>
                  <option value="">Tout type</option>
                  <option value="location">Location</option>
                  <option value="vente">Vente</option>
                </select>
              </div>
              <div className="search-divider"></div>
              <div className="search-field">
                <div className="field-label-group">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <label>Localisation</label>
                </div>
                <input 
                  type="text" 
                  placeholder="Ville..." 
                  value={filters.ville} 
                  onChange={e => setFilters({...filters, ville: e.target.value})}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="search-divider"></div>
              <div className="search-field">
                <div className="field-label-group">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  <label>Type de bien</label>
                </div>
                <select value={filters.type_bien} onChange={e => setFilters({...filters, type_bien: e.target.value})}>
                  <option value="">Tous les biens</option>
                  <option value="appartement">Appartement</option>
                  <option value="villa">Villa</option>
                  <option value="studio">Studio</option>
                  <option value="terrain">Terrain</option>
                  <option value="local">Local Pro</option>
                </select>
              </div>
              <div className="search-divider"></div>
              <div className="search-field">
                <div className="field-label-group">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                  <label>Budget Max</label>
                </div>
                <select value={filters.budget} onChange={e => setFilters({...filters, budget: e.target.value})}>
                  <option value="">Pas de limite</option>
                  <option value="50000">50 000 DA</option>
                  <option value="100000">100 000 DA</option>
                  <option value="500000">500 000 DA</option>
                  <option value="1000000">1 000 000 DA</option>
                  <option value="5000000">5 000 000 DA</option>
                </select>
              </div>
              <button className="search-btn" onClick={handleSearch}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                Rechercher
              </button>
            </div>

            {(filters.keyword || filters.transaction || filters.ville || filters.type_bien || filters.budget) && (
              <button className="reset-search-btn" onClick={handleReset}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
                Réinitialiser les filtres
              </button>
            )}
          </div>

        </div>
      </section>

      {/* Quick Categories */}
      <section className="categories-section">
        <div className="categories-grid">
          <Link to="/categorie/tous" className="category-item">
            <div className="category-icon">✨</div>
            <span>Tout</span>
          </Link>
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

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">10k+</span>
            <span className="stat-label">Biens Disponibles</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">250+</span>
            <span className="stat-label">Agents Partenaires</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">15k+</span>
            <span className="stat-label">Clients Heureux</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">69</span>
            <span className="stat-label">Wilayas Couvertes</span>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="properties-section" ref={resultsRef}>
        <div className="section-header">
          <h2 className="section-title">
            {maisons.length > 0 && (filters.keyword || filters.ville || filters.type_bien || navbarQuery) 
              ? `${maisons.length} Résultat(s) trouvé(s)` 
              : 'Nos Dernières Offres'}
          </h2>
          <p className="section-subtitle">
            {maisons.length > 0 && (filters.keyword || filters.ville || filters.type_bien || navbarQuery)
              ? 'Découvrez les biens correspondant à votre recherche.'
              : 'Découvrez les propriétés récemment ajoutées à notre catalogue.'}
          </p>
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

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2 className="section-title">Ce que disent nos clients</h2>
          <p className="section-subtitle">Découvrez pourquoi des milliers d'utilisateurs nous font confiance.</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">"Grâce à MaisonCllique, j'ai trouvé mon appartement en moins d'une semaine. Le processus était simple et transparent."</p>
            <div className="testimonial-author">
              <div className="author-avatar">👨</div>
              <div className="author-info">
                <span className="author-name">Ahmed B.</span>
                <span className="author-role">Locataire à Alger</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">"Une plateforme très sérieuse. J'ai pu louer ma villa rapidement à des locataires de confiance. Je recommande !"</p>
            <div className="testimonial-author">
              <div className="author-avatar">👩</div>
              <div className="author-info">
                <span className="author-name">Sami R.</span>
                <span className="author-role">Propriétaire à Oran</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-rating">★★★★★</div>
            <p className="testimonial-text">"L'interface est intuitive et les filtres de recherche sont vraiment puissants. C'est le meilleur site immo en Algérie."</p>
            <div className="testimonial-author">
              <div className="author-avatar">🧑</div>
              <div className="author-info">
                <span className="author-name">Karim L.</span>
                <span className="author-role">Investisseur</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Vous êtes propriétaire ?</h2>
          <p>Mettez votre bien en ligne sur MaisonCllique et touchez des milliers de locataires et d'acheteurs potentiels chaque jour.</p>

          <Link to="/register" className="cta-button">Publier une annonce gratuite</Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <h3>Restez informé des nouvelles offres</h3>
            <p>Inscrivez-vous à notre newsletter pour recevoir les meilleures opportunités immobilières directement dans votre boîte mail.</p>
          </div>
          <div className="newsletter-form">
            <input type="email" placeholder="Votre adresse email" />
            <button>S'abonner</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>MaisonCllique</h3>

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
          <p>&copy; {new Date().getFullYear()} MaisonCllique. Tous droits réservés.</p>

        </div>
      </footer>
    </div>
  )
}