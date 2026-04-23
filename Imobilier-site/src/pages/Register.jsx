import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ email:'', password:'', nom:'', prenom:'', telephone:'' })
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
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })
    if (error) { setError(error.message); setLoading(false); return }

    await supabase.from('locataires').insert({
      id: data.user.id,
      nom: form.nom,
      prenom: form.prenom,
      telephone: form.telephone,
      email: form.email,
    })
    setSuccess(true)
    setLoading(false)
  }

  if (success) return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{color:'#27ae60'}}>Compte créé !</h2>
        <p>Vérifiez votre email puis <Link to="/login">connectez-vous</Link>.</p>
      </div>
    </div>
  )

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Dar-Connect</h1>
        <p style={styles.subtitle}>Créer un compte</p>
        <form onSubmit={handleRegister} style={styles.form}>
          <input style={styles.input} name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} required />
          <input style={styles.input} name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} required />
          <input style={styles.input} name="telephone" placeholder="Téléphone" value={form.telephone} onChange={handleChange} />
          <input style={styles.input} name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input style={styles.input} name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} required />
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>
        <p style={styles.link}>Déjà un compte ? <Link to="/login">Se connecter</Link></p>
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