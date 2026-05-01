import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './Navbar.css'

export default function Navbar({ session }) {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <span className="brand-dar">Dar</span><span className="brand-connect">Connect</span>
        </Link>

        {/* Barre de recherche centralisée */}
        <div className="navbar-search">
          <input type="text" placeholder="Rechercher une annonce..." />
          <button className="navbar-search-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        {/* Liens de navigation */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">Accueil</Link>
          
          {session ? (
            <>
              <Link to="/dashboard" className="nav-link">Mes visites</Link>
              <span className="nav-email">{session.user.email}</span>
              <button onClick={handleLogout} className="btn-logout">Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Se connecter</Link>
              <Link to="/register" className="btn-register">S'inscrire</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}