import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import './AddProperty.css'

export default function AddProperty() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [form, setForm] = useState({
    titre: '',
    description: '',
    prix: '',
    ville: '',
    adresse: '',
    type_transaction: 'vente',
    type_bien: 'appartement',
    surface: '',
    chambres: '',
    sdb: ''
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  function removeImage() {
    setFile(null)
    setPreview(null)
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
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('maison-images')
          .upload(filePath, file)

        if (uploadError) {
          if (uploadError.message.includes('Bucket not found')) {
            throw new Error("Le dossier d'images n'existe pas sur Supabase. Veuillez exécuter le script SQL fourni dans le plan d'implémentation.")
          }
          throw uploadError
        }

        const { data } = supabase.storage
          .from('maison-images')
          .getPublicUrl(filePath)
        
        image_url = data.publicUrl
      }

      const { error: insertError } = await supabase.from('maisons').insert({
        titre: form.titre,
        description: form.description,
        prix: parseInt(form.prix),
        ville: form.ville,
        adresse: form.adresse,
        type_transaction: form.type_transaction,
        type_bien: form.type_bien,
        image_url,
        disponible: true,
        proprietaire_id: user.id,
        surface: parseInt(form.surface) || null,
        chambres: parseInt(form.chambres) || null,
        sdb: parseInt(form.sdb) || null
      })

      if (insertError) {
        if (insertError.message.includes('column') && (insertError.message.includes('type_bien') || insertError.message.includes('chambres'))) {
          throw new Error("Des colonnes manquent dans votre table 'maisons'. Veuillez ajouter la colonne 'type_bien' (TEXT) ainsi que les autres colonnes numériques via le script SQL.")
        }
        throw insertError
      }

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
              <label>Type de bien</label>
              <select name="type_bien" value={form.type_bien} onChange={handleChange}>
                <option value="appartement">Appartement</option>
                <option value="villa">Villa</option>
                <option value="studio">Studio</option>
                <option value="terrain">Terrain</option>
                <option value="local-pro">Local Pro</option>
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

            <div className="form-group">
              <label>Surface (m²)</label>
              <input 
                type="number" 
                name="surface" 
                placeholder="Ex: 120" 
                value={form.surface} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label>Nombre de chambres</label>
              <input 
                type="number" 
                name="chambres" 
                placeholder="Ex: 3" 
                value={form.chambres} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label>Salles de bain</label>
              <input 
                type="number" 
                name="sdb" 
                placeholder="Ex: 1" 
                value={form.sdb} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group full-width">
              <label>Description détaillée</label>
              <textarea 
                name="description" 
                placeholder="Décrivez votre bien (équipements, proximité...)" 
                value={form.description} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group full-width">
              <label>Image du bien</label>
              {!preview ? (
                <div className="custom-file-upload">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    id="property-image" 
                    required
                  />
                  <label htmlFor="property-image" className="file-label">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Choisir une belle photo
                  </label>
                </div>
              ) : (
                <div className="image-preview-container">
                  <img src={preview} alt="Aperçu" className="image-preview" />
                  <button type="button" className="remove-image-btn" onClick={removeImage}>
                    Supprimer l'image
                  </button>
                </div>
              )}
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
