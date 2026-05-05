import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './Navbar.css'

export default function Navbar({ session }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [hasNewNotif, setHasNewNotif] = useState(false)

  async function checkNotifications() {
    if (!session?.user) return

    // On cherche les visites en attente pour les biens dont l'utilisateur est propriétaire
    // C'est le signal "nouveau" pour le propriétaire
    const { count, error } = await supabase
      .from('visites')
      .select('*, maisons!inner(proprietaire_id)', { count: 'exact', head: true })
      .eq('maisons.proprietaire_id', session.user.id)
      .eq('statut', 'en_attente')

    if (error) {
      console.error("Erreur notifications:", error)
      return
    }

    setHasNewNotif(count > 0)
  }

  useEffect(() => {
    if (!session) return

    checkNotifications()

    // S'abonner aux changements en temps réel pour mettre à jour la cloche immédiatement
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'visites' }, () => {
        checkNotifications()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session])

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

              <div className="notification-bell" onClick={() => { setHasNewNotif(false); navigate('/dashboard'); }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {hasNewNotif && <span className="notification-badge"></span>}
              </div>
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