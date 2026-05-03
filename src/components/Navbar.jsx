import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './Navbar.css'

export default function Navbar({ session }) {
  const navigate = useNavigate()
  const location = useLocation()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <span className="brand-dar">Maison</span><span className="brand-connect">Cllique</span>
        </Link>


        {/* Liens de navigation */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>Accueil</Link>
          
          {session ? (
            <>
              <Link to="/publier" className={`nav-link ${isActive('/publier')}`}>Publier une annonce</Link>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>Mes visites</Link>
              <span className="nav-email">{session.user.email}</span>

              <button onClick={handleLogout} className="btn-logout">Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${isActive('/login')}`}>Se connecter</Link>
              <Link to="/register" className={`nav-link ${isActive('/register')}`}>S'inscrire</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}