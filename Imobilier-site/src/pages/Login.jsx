import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Dar-Connect</h1>
        <p style={styles.subtitle}>Connexion</p>
        <form onSubmit={handleLogin} style={styles.form}>
          <input style={styles.input} type="email" placeholder="Email"
            value={email} onChange={e => setEmail(e.target.value)} required />
          <input style={styles.input} type="password" placeholder="Mot de passe"
            value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <p style={styles.link}>Pas de compte ? <Link to="/register">S'inscrire</Link></p>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f5f0eb' },
  card: { background:'white', padding:'2.5rem', borderRadius:'12px', width:'100%', maxWidth:'400px', boxShadow:'0 4px 24px rgba(0,0,0,0.10)' },
  title: { margin:0, color:'#8B5E2A', fontSize:'2rem', fontWeight:'700' },
  subtitle: { color:'#888', marginBottom:'1.5rem' },
  form: { display:'flex', flexDirection:'column', gap:'1rem' },
  input: { padding:'0.75rem 1rem', borderRadius:'8px', border:'1px solid #ddd', fontSize:'1rem' },
  btn: { padding:'0.75rem', background:'#8B5E2A', color:'white', border:'none', borderRadius:'8px', fontSize:'1rem', cursor:'pointer' },
  error: { color:'#c0392b', fontSize:'0.9rem', margin:0 },
  link: { textAlign:'center', marginTop:'1rem', color:'#888' }
}