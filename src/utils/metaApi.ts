import axios from 'axios';
import stringSimilarity from 'string-similarity';
import { MetaSuggestion } from '../types';

/**
 * Obtient les suggestions d'intérêts depuis l'API Facebook Marketing via notre API proxy
 * @param keyword Mot-clé à rechercher
 * @returns Promise avec les suggestions
 */
export const getMetaSuggestions = async (keyword: string): Promise<MetaSuggestion[]> => {
  if (!keyword || keyword.trim() === '') {
    return [];
  }

  try {
    // Utiliser notre route API proxy au lieu d'appeler directement l'API Meta
    const apiUrl = '/api/meta-suggestions';
    const params = {
      q: keyword,
    };

    const response = await axios.get(apiUrl, { params });
    
    // Transforme la réponse API en format standard
    if (response.data && response.data.data) {
      return response.data.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        audience_size: item.audience_size,
        path: item.path || [],
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Erreur lors de la récupération des suggestions Meta:', error);
    return [];
  }
};

/**
 * Calcule le score de similarité entre le mot-clé original et les suggestions
 * @param originalValue Valeur originale du fichier Excel
 * @param suggestions Suggestions de l'API Meta
 * @returns Suggestions avec scores de similarité
 */
export const calculateSimilarityScores = (
  originalValue: string,
  suggestions: MetaSuggestion[]
): MetaSuggestion[] => {
  if (!suggestions.length) return [];
  
  // Normalisation du texte pour une meilleure comparaison
  const normalizeText = (text: string) => text.toLowerCase().trim();
  const normalizedOriginal = normalizeText(originalValue);
  
  // Calcule le score de similarité pour chaque suggestion
  const scoredSuggestions = suggestions.map(suggestion => {
    const normalizedName = normalizeText(suggestion.name);
    const similarityScore = stringSimilarity.compareTwoStrings(normalizedOriginal, normalizedName);
    
    return {
      ...suggestion,
      similarityScore,
    };
  });
  
  // Trie les suggestions par score de similarité (décroissant)
  // Si les scores sont proches (différence < 0.1), privilégie la plus grande audience
  return scoredSuggestions.sort((a, b) => {
    const scoreDiff = b.similarityScore! - a.similarityScore!;
    
    // Si les scores sont très proches, on utilise la taille d'audience comme critère secondaire
    if (Math.abs(scoreDiff) < 0.1 && a.audience_size && b.audience_size) {
      return b.audience_size - a.audience_size;
    }
    
    return scoreDiff;
  });
};

/**
 * Sélectionne la meilleure suggestion en fonction de la similarité et de la taille d'audience
 * @param originalValue Valeur originale
 * @param suggestions Suggestions avec scores
 * @returns La meilleure suggestion
 */
export const selectBestSuggestion = (
  originalValue: string,
  suggestions: MetaSuggestion[]
): MetaSuggestion | null => {
  if (!suggestions.length) return null;
  
  // On prend la première suggestion après tri (meilleur score de similarité avec prise en compte de l'audience)
  return suggestions[0];
};