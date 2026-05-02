import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link } from 'react-router-dom'
import './Auth.css'

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
    <div className="auth-page animate-fade-in">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9.5L12 4L21 9.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 13V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <h1 className="auth-title">Dar Connect</h1>
        <p className="auth-subtitle">Content de vous revoir ! Connectez-vous.</p>
        
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group" style={{marginBottom: 0}}>
            <input className="form-input" type="email" placeholder="Adresse email"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group" style={{marginBottom: 0}}>
            <input className="form-input" type="password" placeholder="Mot de passe"
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <button className="btn btn-primary auth-btn" type="submit" disabled={loading}>
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
        
        <p className="auth-link">
          Pas encore de compte ? <Link to="/register">Créer un compte</Link>
        </p>
      </div>
    </div>
  )
}