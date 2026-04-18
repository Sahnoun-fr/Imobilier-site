import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Navbar({ session }) {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>Dar-Connect</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Maisons</Link>
        <Link to="/dashboard" style={styles.link}>Mes visites</Link>
        <span style={styles.email}>{session.user.email}</span>
        <button onClick={handleLogout} style={styles.logout}>Déconnexion</button>
      </div>
    </nav>
  )
}

const styles = {
  nav: { background:'#8B5E2A', padding:'0.75rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between' },
  brand: { color:'white', fontWeight:'700', fontSize:'1.3rem', textDecoration:'none' },
  links: { display:'flex', alignItems:'center', gap:'1.5rem' },
  link: { color:'rgba(255,255,255,0.85)', textDecoration:'none', fontSize:'0.95rem' },
  email: { color:'rgba(255,255,255,0.65)', fontSize:'0.85rem' },
  logout: { background:'rgba(255,255,255,0.15)', color:'white', border:'none', padding:'0.4rem 0.9rem', borderRadius:'6px', cursor:'pointer', fontSize:'0.9rem' }
}