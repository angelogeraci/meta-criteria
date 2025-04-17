# Meta Criteria

Application web permettant d'analyser des fichiers Excel et de trouver des suggestions d'intérêts correspondantes via l'API Marketing de Meta.

## Fonctionnalités

- Upload de fichiers Excel
- Sélection de colonnes spécifiques
- Connexion à l'API Marketing de Meta pour obtenir des suggestions d'intérêts
- Algorithme de correspondance basé sur la similarité et la taille d'audience
- Interface intuitive pour visualiser et modifier les suggestions
- Export des résultats en Excel

## Configuration

### Variables d'environnement requises

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```
META_APP_ID=votre_app_id
META_APP_SECRET=votre_app_secret
META_ACCESS_TOKEN=votre_access_token
```

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

## Production

```bash
npm run build
npm run start
```