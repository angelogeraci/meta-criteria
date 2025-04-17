import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware pour configurer les headers CORS
export function middleware(request: NextRequest) {
  // Appliquer CORS uniquement aux routes API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Handle CORS preflight requests
    const origin = request.headers.get('origin') || '';
    
    // Créer la réponse et ajouter les headers CORS
    return NextResponse.next({
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }
  
  // Pour les requêtes non-API, continuer normalement
  return NextResponse.next();
}

// Configurer les routes qui déclenchent le middleware
export const config = {
  matcher: [
    // Matcher pour toutes les routes API
    '/api/:path*',
  ],
};