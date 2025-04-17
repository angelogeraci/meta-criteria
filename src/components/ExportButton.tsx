import React from 'react';
import { ResultRow } from '../types';
import { exportToExcel, prepareDataForExport } from '../utils/excelUtils';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface ExportButtonProps {
  results: ResultRow[];
  isDisabled: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({ results, isDisabled }) => {
  const handleExport = () => {
    if (isDisabled || results.length === 0) return;
    
    // Préparer les données pour l'export
    const exportData = prepareDataForExport(results);
    
    // Générer un nom de fichier avec date et heure
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    const filename = `meta_criteria_export_${timestamp}`;
    
    // Exporter en Excel
    exportToExcel(exportData, filename);
  };

  return (
    <button
      onClick={handleExport}
      disabled={isDisabled}
      className={`btn-primary flex items-center ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
      Exporter en Excel
    </button>
  );
};

export default ExportButton;