# Maison Click (anciennement Dar-Connect)

Bienvenue sur le dépôt de **Maison Click**, une plateforme immobilière moderne et intuitive. 
Cette application permet aux utilisateurs de parcourir, rechercher et publier des annonces immobilières (maisons, appartements, terrains, etc.).

## 🚀 Technologies Utilisées

Ce projet est développé avec des technologies modernes pour assurer des performances optimales et une expérience utilisateur fluide :

- **Frontend :** [React](https://reactjs.org/) (v19) avec [Vite](https://vitejs.dev/) pour un développement et un build ultra-rapides.
- **Routage :** [React Router DOM](https://reactrouter.com/) pour la navigation entre les pages.
- **Backend / Base de données :** [Supabase](https://supabase.com/) pour la gestion de l'authentification, la base de données PostgreSQL et le stockage.
- **Stylisation :** CSS pur et moderne (fichiers CSS modulaires par composant/page).

## 📁 Structure du Projet

L'application est structurée de la manière suivante :

- `src/components/` : Composants réutilisables (ex: `Navbar.jsx`).
- `src/pages/` : Les différentes vues de l'application :
  - `Home.jsx` : Page d'accueil avec la liste des propriétés et les filtres de recherche.
  - `Maison.jsx` : Page de détails d'une propriété spécifique.
  - `AddProperty.jsx` : Formulaire pour ajouter une nouvelle annonce immobilière.
  - `Category.jsx` : Affichage des biens par catégorie.
  - `Dashboard.jsx` : Tableau de bord utilisateur.
  - `Login.jsx` & `Register.jsx` : Pages d'authentification.
  - `About.jsx` : Page d'information sur la plateforme.
- `src/supabaseClient.js` : Configuration et initialisation du client Supabase.

## 🛠️ Installation et Lancement Local

Pour exécuter ce projet localement, suivez ces étapes :

### 1. Cloner le dépôt
```bash
git clone <votre-url-de-repo>
cd "maison click"
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration des variables d'environnement
Créez un fichier `.env` à la racine du projet et ajoutez vos clés Supabase :
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

### 4. Lancer le serveur de développement
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:5173`.

## 🤝 Contribution

Les contributions, problèmes (issues) et demandes de fonctionnalités (feature requests) sont les bienvenus !
N'hésitez pas à vérifier les *issues* existantes si vous souhaitez contribuer.

## 📝 Scripts Disponibles

- `npm run dev` : Démarre le serveur de développement.
- `npm run build` : Compile l'application pour la production.
- `npm run lint` : Vérifie le code avec ESLint.
- `npm run preview` : Prévisualise l'application compilée localement.
