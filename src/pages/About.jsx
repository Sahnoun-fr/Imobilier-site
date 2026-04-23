import React from 'react'

export default function About() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>À propos de Dar-Connect</h1>
          <p style={styles.subtitle}>Votre partenaire de confiance pour l'immobilier en Algérie</p>
        </div>

        <div style={styles.content}>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Notre Mission</h2>
            <p style={styles.text}>
              Dar-Connect a été créé avec un objectif simple : simplifier la recherche et la location de biens immobiliers.
              Nous mettons en relation les propriétaires et les locataires à travers une plateforme intuitive, sécurisée et transparente.
              Que vous cherchiez une maison chaleureuse pour votre famille ou un appartement moderne au cœur de la ville, nous sommes là pour vous accompagner.
            </p>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Pourquoi nous choisir ?</h2>
            <div style={styles.grid}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Transparence</h3>
                <p style={styles.cardText}>Toutes nos annonces sont vérifiées pour vous garantir des informations précises et fiables.</p>
              </div>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Sécurité</h3>
                <p style={styles.cardText}>Nous protégeons vos données et sécurisons vos démarches, de la visite jusqu'à la signature.</p>
              </div>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Simplicité</h3>
                <p style={styles.cardText}>Notre interface facile à utiliser vous permet de trouver et de gérer vos visites en quelques clics.</p>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Notre Équipe</h2>
            <p style={styles.text}>
              Derrière Dar-Connect se cache une équipe de passionnés de la technologie et de l'immobilier, dévouée à améliorer constamment votre expérience utilisateur. Nous travaillons chaque jour pour rendre le marché immobilier plus accessible à tous.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { padding: '3rem 1.5rem', background: '#f8f9fa', minHeight: 'calc(100vh - 60px)' },
  container: { maxWidth: '1000px', margin: '0 auto', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' },
  header: { background: 'linear-gradient(135deg, #8B5E2A, #A67C52)', padding: '4rem 2rem', textAlign: 'center', color: 'white' },
  title: { margin: '0 0 1rem 0', fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.5px' },
  subtitle: { margin: 0, fontSize: '1.2rem', opacity: 0.9, fontWeight: '300' },
  content: { padding: '3rem' },
  section: { marginBottom: '3rem' },
  sectionTitle: { color: '#8B5E2A', fontSize: '1.8rem', marginBottom: '1.5rem', fontWeight: '700', borderBottom: '3px solid #f0e6d2', paddingBottom: '0.5rem', display: 'inline-block' },
  text: { color: '#555', fontSize: '1.1rem', lineHeight: '1.8', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '1.5rem' },
  card: { background: '#fdfbf7', padding: '2rem', borderRadius: '12px', border: '1px solid #f0e6d2', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-5px)' } },
  cardTitle: { color: '#333', fontSize: '1.3rem', marginBottom: '1rem', fontWeight: '600' },
  cardText: { color: '#666', lineHeight: '1.6', margin: 0 }
}
