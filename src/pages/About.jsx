import React from 'react'
import './About.css'

export default function About() {
  return (
    <div className="page-container animate-fade-in">
      <div className="about-container card">
        <div className="about-header">
          <h1 className="about-title">À propos de Maison Click</h1>
          <p className="about-subtitle">Votre partenaire de confiance pour l'immobilier</p>
        </div>

        <div className="about-content">
          <div className="about-section">
            <h2 className="section-title">Notre Mission</h2>
            <p className="section-text">
              Maison Click a été créé avec un objectif simple : simplifier la recherche et la location de biens immobiliers.
              Nous mettons en relation les propriétaires et les locataires à travers une plateforme intuitive, sécurisée et transparente.
              Que vous cherchiez une maison chaleureuse pour votre famille ou un appartement moderne au cœur de la ville, nous sommes là pour vous accompagner.
            </p>
          </div>

          <div className="about-section">
            <h2 className="section-title">Pourquoi nous choisir ?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
                <h3 className="feature-title">Transparence</h3>
                <p className="feature-text">Toutes nos annonces sont vérifiées pour vous garantir des informations précises et fiables.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h3 className="feature-title">Sécurité</h3>
                <p className="feature-text">Nous protégeons vos données et sécurisons vos démarches, de la visite jusqu'à la signature.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                  </svg>
                </div>
                <h3 className="feature-title">Simplicité</h3>
                <p className="feature-text">Notre interface facile à utiliser vous permet de trouver et de gérer vos visites en quelques clics.</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2 className="section-title">Notre Équipe</h2>
            <p className="section-text">
              Derrière Maison Click se cache une équipe de passionnés de la technologie et de l'immobilier, dévouée à améliorer constamment votre expérience utilisateur. Nous travaillons chaque jour pour rendre le marché immobilier plus accessible à tous.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
