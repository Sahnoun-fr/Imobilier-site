import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link } from 'react-router-dom'
import './Auth.css'

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

export default function Register() {
  const [form, setForm] = useState({ email:'', password:'', nom:'', prenom:'', telephone:'' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          nom: form.nom,
          prenom: form.prenom,
          telephone: form.telephone
        }
      }
    })
    
    if (error) { 
      setError(error.message)
      setLoading(false)
      return 
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) return (
    <div className="auth-page animate-fade-in">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon" style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)'}}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
        <h2 className="auth-title">Compte créé !</h2>
        <p className="auth-subtitle">Veuillez vérifier votre email pour confirmer votre inscription.</p>
        <Link to="/login" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>
          Aller à la connexion
        </Link>
      </div>
    </div>
  )

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
        
        <h1 className="auth-title">MaisonCllique</h1>

        <p className="auth-subtitle">Créez votre compte pour commencer</p>
        
        <form onSubmit={handleRegister} className="auth-form">
          <div style={{display: 'flex', gap: '1rem'}}>
            <div className="form-group" style={{marginBottom: 0, flex: 1}}>
              <input className="form-input" name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} required />
            </div>
            <div className="form-group" style={{marginBottom: 0, flex: 1}}>
              <input className="form-input" name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group" style={{marginBottom: 0}}>
            <input className="form-input" name="telephone" placeholder="Numéro de téléphone" value={form.telephone} onChange={handleChange} />
          </div>
          <div className="form-group" style={{marginBottom: 0}}>
            <input className="form-input" name="email" type="email" placeholder="Adresse email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group password-wrapper" style={{marginBottom: 0}}>
            <input className="form-input" name="password" type={showPassword ? 'text' : 'password'} placeholder="Mot de passe" value={form.password} onChange={handleChange} required />
            <button type="button" className="password-toggle" onClick={() => setShowPassword(v => !v)}>
              <EyeIcon open={showPassword} />
            </button>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <button className="btn btn-primary auth-btn" type="submit" disabled={loading}>
            {loading ? 'Inscription en cours...' : "S'inscrire"}
          </button>
        </form>
        
        <p className="auth-link">
          Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}