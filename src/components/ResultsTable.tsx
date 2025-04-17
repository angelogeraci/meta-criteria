import React, { useState } from 'react';
import { ResultRow, MetaSuggestion } from '../types';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface ResultsTableProps {
  results: ResultRow[];
  onSuggestionChange: (index: number, suggestion: MetaSuggestion) => void;
  isLoading: boolean;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ 
  results, 
  onSuggestionChange,
  isLoading 
}) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const handleToggleDropdown = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleSelectSuggestion = (rowIndex: number, suggestion: MetaSuggestion) => {
    onSuggestionChange(rowIndex, suggestion);
    setOpenDropdown(null);
  };

  if (isLoading) {
    return (
      <div className="card text-center p-10">
        <div className="inline-block animate-spin h-10 w-10 border-4 border-meta-blue border-t-transparent rounded-full mb-4"></div>
        <p className="text-lg text-gray-600">Récupération des suggestions depuis Meta...</p>
        <p className="text-sm text-gray-500 mt-2">Cela peut prendre quelques instants</p>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="card overflow-hidden mb-6">
      <h2 className="text-xl font-semibold mb-4">3. Résultats et suggestions</h2>
      <p className="text-gray-600 mb-4">
        Vous pouvez modifier les suggestions sélectionnées en utilisant le menu déroulant
      </p>

      <div className="overflow-x-auto -mx-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valeur Originale
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Suggestion Choisie
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Taille d'audience
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score de similarité
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {result.originalValue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.selectedSuggestion?.name || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.selectedSuggestion?.audience_size 
                    ? new Intl.NumberFormat().format(result.selectedSuggestion.audience_size)
                    : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.selectedSuggestion?.similarityScore 
                    ? `${(result.selectedSuggestion.similarityScore * 100).toFixed(0)}%`
                    : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                  <button
                    onClick={() => handleToggleDropdown(index)}
                    className="text-meta-blue hover:text-blue-700 flex items-center"
                    disabled={result.suggestions.length === 0}
                  >
                    Modifier <ChevronDownIcon className="h-4 w-4 ml-1" />
                  </button>
                  
                  {openDropdown === index && (
                    <div className="absolute z-10 mt-1 w-72 bg-white shadow-lg rounded-md border border-gray-200 py-1 left-0">
                      {result.suggestions.length > 0 ? (
                        result.suggestions.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            onClick={() => handleSelectSuggestion(index, suggestion)}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                              result.selectedSuggestion?.id === suggestion.id ? 'bg-meta-light font-medium' : ''
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{suggestion.name}</span>
                              <span className="text-xs text-gray-500">
                                {suggestion.similarityScore 
                                  ? `${(suggestion.similarityScore * 100).toFixed(0)}%`
                                  : ''}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {suggestion.audience_size
                                ? `Audience: ${new Intl.NumberFormat().format(suggestion.audience_size)}`
                                : 'Taille d\'audience inconnue'}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          Aucune suggestion disponible
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;