import React, { useState, useRef } from 'react';
import { ExcelColumn } from '../types';
import { readExcelFile } from '../utils/excelUtils';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';

interface FileUploadProps {
  onFileProcessed: (data: any[], columns: ExcelColumn[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed }) => {
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setFileName(file.name);
    setError(null);
    setIsLoading(true);

    try {
      // Vérifier l'extension du fichier
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        throw new Error('Format de fichier non pris en charge. Veuillez télécharger un fichier Excel (.xlsx, .xls)');
      }

      const { data, columns } = await readExcelFile(file);
      onFileProcessed(data, columns);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors du traitement du fichier');
      console.error('File processing error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="card mb-6">
      <h2 className="text-xl font-semibold mb-4">1. Téléchargez votre fichier Excel</h2>
      
      <div 
        className={`border-2 border-dashed p-8 rounded-lg text-center cursor-pointer transition-colors ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-meta-blue'
        }`}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".xlsx,.xls"
          className="hidden"
        />
        
        <DocumentArrowUpIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
        
        {!fileName ? (
          <p className="text-gray-500">
            Cliquez ou glissez-déposez votre fichier Excel ici
            <br />
            <span className="text-sm">(.xlsx, .xls)</span>
          </p>
        ) : (
          <p className="text-gray-800 font-medium">
            Fichier sélectionné: <span className="text-meta-blue">{fileName}</span>
          </p>
        )}
      </div>

      {isLoading && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin h-6 w-6 border-4 border-meta-blue border-t-transparent rounded-full"></div>
          <p className="text-gray-600 mt-2">Traitement du fichier en cours...</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          <p className="font-medium">Erreur</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;