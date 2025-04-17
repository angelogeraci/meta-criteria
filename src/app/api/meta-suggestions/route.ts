import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  // Récupérer le paramètre 'q' de l'URL
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Le paramètre de requête "q" est requis' }, { status: 400 });
  }

  try {
    // Récupérer les identifiants Meta à partir des variables d'environnement
    const accessToken = process.env.META_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Configuration de l\'API Meta manquante. Veuillez vérifier les variables d\'environnement.' },
        { status: 500 }
      );
    }

    // Appeler l'API Meta
    const apiUrl = 'https://graph.facebook.com/v18.0/search';
    const response = await axios.get(apiUrl, {
      params: {
        q: query,
        type: 'adinterest',
        limit: 10,
        access_token: accessToken,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Erreur lors de la requête à l\'API Meta:', error);
    
    // Gérer les erreurs de l'API Meta
    const status = error.response?.status || 500;
    const errorMessage = error.response?.data?.error?.message || 'Une erreur est survenue lors de la communication avec l\'API Meta';
    
    return NextResponse.json({ error: errorMessage }, { status });
  }
}

// Désactiver le corps de réponse pour les méthodes OPTIONS (CORS preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}