import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import './AddProperty.css'

export default function AddProperty() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [file, setFile] = useState(null)
  const [form, setForm] = useState({
    titre: '',
    description: '',
    prix: '',
    ville: '',
    adresse: '',
    type_transaction: 'vente'
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Vous devez être connecté pour publier une annonce.")

      let image_url = null
      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('maison-images')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('maison-images')
          .getPublicUrl(fileName)
        
        image_url = urlData.publicUrl
      }

      const { error: insertError } = await supabase.from('maisons').insert({
        ...form,
        prix: parseInt(form.prix),
        image_url,
        disponible: true,
        // On suppose que la colonne s'appelle proprietaire_id
        // Si elle n'existe pas, l'insertion pourrait échouer ou ignorer le champ
        proprietaire_id: user.id 
      })

      if (insertError) throw insertError

      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-property-page animate-fade-in">
      <div className="add-property-container">
        <div className="form-header">
          <h1>Publier une annonce</h1>
          <p>Remplissez les informations pour mettre votre bien en ligne sur MaisonCllique.</p>
        </div>

        <form onSubmit={handleSubmit} className="property-form card">
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Titre de l'annonce</label>
              <input 
                type="text" 
                name="titre" 
                placeholder="Ex: Belle Villa avec Piscine" 
                value={form.titre} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Type de transaction</label>
              <select name="type_transaction" value={form.type_transaction} onChange={handleChange}>
                <option value="vente">Vente</option>
                <option value="location">Location</option>
              </select>
            </div>

            <div className="form-group">
              <label>Prix (DA)</label>
              <input 
                type="number" 
                name="prix" 
                placeholder="Ex: 50000" 
                value={form.prix} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Ville</label>
              <input 
                type="text" 
                name="ville" 
                placeholder="Ex: Alger" 
                value={form.ville} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Adresse précise</label>
              <input 
                type="text" 
                name="adresse" 
                placeholder="Ex: 12 Rue des jardins" 
                value={form.adresse} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group full-width">
              <label>Description détaillée</label>
              <textarea 
                name="description" 
                placeholder="Décrivez votre bien (nombre de chambres, surface, équipements...)" 
                value={form.description} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group full-width">
              <label>Image du bien</label>
              <div className="custom-file-upload">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => setFile(e.target.files[0])} 
                  id="property-image" 
                />
                <label htmlFor="property-image" className="file-label">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  {file ? file.name : "Choisir une belle photo"}
                </label>
              </div>
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Publication...' : 'Publier mon annonce'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
