'use client';

import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ColumnSelector from '../components/ColumnSelector';
import ResultsTable from '../components/ResultsTable';
import ExportButton from '../components/ExportButton';
import { ExcelColumn, ResultRow, MetaSuggestion, ParsedRow } from '../types';
import { 
  getMetaSuggestions, 
  calculateSimilarityScores, 
  selectBestSuggestion 
} from '../utils/metaApi';

export default function Home() {
  const [excelData, setExcelData] = useState<ParsedRow[]>([]);
  const [columns, setColumns] = useState<ExcelColumn[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [processedCount, setProcessedCount] = useState<number>(0);
  const [totalToProcess, setTotalToProcess] = useState<number>(0);

  // Gérer le fichier Excel téléchargé
  const handleFileProcessed = (data: ParsedRow[], columns: ExcelColumn[]) => {
    setExcelData(data);
    setColumns(columns);
    setSelectedColumn(null);
    setResults([]);
  };

  // Gérer la sélection de colonne et lancer le processus
  const handleColumnSelect = async (columnKey: string) => {
    setSelectedColumn(columnKey);
    
    if (!excelData.length || !columnKey) return;
    
    // Initialiser les variables de traitement
    setIsProcessing(true);
    setResults([]);
    setProcessedCount(0);
    
    const uniqueValues = new Set<string>();
    
    // Collecter les valeurs uniques de la colonne sélectionnée
    excelData.forEach(row => {
      const value = String(row[columnKey] || '').trim();
      if (value) {
        uniqueValues.add(value);
      }
    });
    
    const uniqueArray = Array.from(uniqueValues);
    setTotalToProcess(uniqueArray.length);
    
    // Traiter chaque valeur unique
    const newResults: ResultRow[] = [];
    
    for (let i = 0; i < uniqueArray.length; i++) {
      const value = uniqueArray[i];
      setProcessingStatus(`Traitement de "${value}"`);
      
      try {
        // 1. Récupérer les suggestions de Meta
        const suggestions = await getMetaSuggestions(value);
        
        // 2. Calculer les scores de similarité
        const scoredSuggestions = calculateSimilarityScores(value, suggestions);
        
        // 3. Sélectionner la meilleure suggestion
        const bestSuggestion = selectBestSuggestion(value, scoredSuggestions);
        
        // 4. Ajouter aux résultats
        newResults.push({
          originalValue: value,
          suggestions: scoredSuggestions,
          selectedSuggestion: bestSuggestion,
        });
        
        // Mettre à jour le compteur de progression
        setProcessedCount(i + 1);
      } catch (error) {
        console.error(`Erreur lors du traitement de "${value}":`, error);
        newResults.push({
          originalValue: value,
          suggestions: [],
          selectedSuggestion: null,
        });
      }
    }
    
    setResults(newResults);
    setIsProcessing(false);
  };

  // Gérer le changement de suggestion sélectionnée
  const handleSuggestionChange = (index: number, suggestion: MetaSuggestion) => {
    const newResults = [...results];
    newResults[index].selectedSuggestion = suggestion;
    setResults(newResults);
  };

  // Calculer les pourcentages de progrès
  const progressPercentage = totalToProcess > 0 
    ? Math.round((processedCount / totalToProcess) * 100) 
    : 0;

  return (
    <div>
      {/* Section de téléchargement de fichier */}
      <FileUpload onFileProcessed={handleFileProcessed} />
      
      {/* Section de sélection de colonne */}
      <ColumnSelector
        columns={columns}
        selectedColumn={selectedColumn}
        onColumnSelect={handleColumnSelect}
        isDisabled={excelData.length === 0 || isProcessing}
      />
      
      {/* Indicateur de progression */}
      {isProcessing && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Traitement en cours</h2>
          
          <div className="mb-2 flex justify-between">
            <span>{processingStatus}</span>
            <span>{processedCount} / {totalToProcess}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-meta-blue h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <p className="mt-2 text-sm text-gray-500">
            Récupération des suggestions depuis l'API Meta...
          </p>
        </div>
      )}
      
      {/* Tableau de résultats */}
      {(results.length > 0 || isProcessing) && (
        <ResultsTable 
          results={results} 
          onSuggestionChange={handleSuggestionChange}
          isLoading={isProcessing} 
        />
      )}
      
      {/* Bouton d'export */}
      {results.length > 0 && !isProcessing && (
        <div className="flex justify-end">
          <ExportButton 
            results={results} 
            isDisabled={isProcessing || results.length === 0} 
          />
        </div>
      )}
    </div>
  );
}