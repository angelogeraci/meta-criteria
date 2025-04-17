import * as XLSX from 'xlsx';
import { ExcelColumn, ParsedRow } from '../types';

/**
 * Lit un fichier Excel et retourne les données sous forme de tableau d'objets
 * @param file Fichier Excel à lire
 * @returns Promise avec les données et les colonnes
 */
export const readExcelFile = async (file: File): Promise<{
  data: ParsedRow[];
  columns: ExcelColumn[];
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convertir la feuille en JSON
        const jsonData = XLSX.utils.sheet_to_json<ParsedRow>(worksheet);
        
        // Extraire les noms de colonnes
        const columns: ExcelColumn[] = [];
        if (jsonData.length > 0) {
          const firstRow = jsonData[0];
          Object.keys(firstRow).forEach((key) => {
            columns.push({
              name: key,
              key,
            });
          });
        }
        
        resolve({ data: jsonData, columns });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsBinaryString(file);
  });
};

/**
 * Exporte les données en Excel
 * @param data Données à exporter
 * @param filename Nom du fichier
 */
export const exportToExcel = (data: any[], filename: string): void => {
  // Créer un workbook
  const workbook = XLSX.utils.book_new();
  
  // Convertir les données en worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Ajouter la worksheet au workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
  
  // Exporter le workbook en fichier Excel
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

/**
 * Prépare les données pour l'export Excel
 * @param results Résultats à exporter
 * @returns Données formatées pour l'export
 */
export const prepareDataForExport = (results: any[]): any[] => {
  return results.map(result => {
    const selected = result.selectedSuggestion;
    return {
      'Valeur Originale': result.originalValue,
      'Suggestion Sélectionnée': selected ? selected.name : '',
      'ID Meta': selected ? selected.id : '',
      'Taille Audience': selected ? (selected.audience_size || 'N/A') : '',
      'Score de Similarité': selected ? (selected.similarityScore?.toFixed(2) || 'N/A') : '',
    };
  });
};