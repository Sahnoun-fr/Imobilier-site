import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './Navbar.css' // We will create this or just put classes in index.css

export default function Navbar({ session }) {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9.5L12 4L21 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 13V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 21V12H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        Maison Click
      </Link>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Maisons</Link>
        <Link to="/about" className="nav-link">À propos</Link>
        <Link to="/dashboard" className="nav-link">Mes visites</Link>
        <div className="navbar-user">
          <span className="user-email">{session.user.email}</span>
          <button onClick={handleLogout} className="btn-logout">Déconnexion</button>
        </div>
      </div>
    </nav>
  )
}