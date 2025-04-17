import React from 'react';
import { ExcelColumn } from '../types';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface ColumnSelectorProps {
  columns: ExcelColumn[];
  selectedColumn: string | null;
  onColumnSelect: (columnKey: string) => void;
  isDisabled: boolean;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  columns,
  selectedColumn,
  onColumnSelect,
  isDisabled,
}) => {
  if (columns.length === 0) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onColumnSelect(e.target.value);
  };

  // Trouver la colonne sélectionnée
  const selectedColumnName = selectedColumn
    ? columns.find(col => col.key === selectedColumn)?.name || ''
    : '';

  return (
    <div className="card mb-6">
      <h2 className="text-xl font-semibold mb-4">2. Sélectionnez une colonne</h2>
      <p className="text-gray-600 mb-4">
        Choisissez la colonne contenant les termes à rechercher dans l'API Meta
      </p>

      <div className="relative">
        <select
          value={selectedColumn || ''}
          onChange={handleChange}
          disabled={isDisabled}
          className={`dropdown pr-10 appearance-none w-full ${
            isDisabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <option value="" disabled>
            {columns.length > 0
              ? 'Sélectionnez une colonne'
              : 'Aucune colonne disponible'}
          </option>
          {columns.map((column) => (
            <option key={column.key} value={column.key}>
              {column.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </div>

      {selectedColumn && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md">
          <p>
            Colonne sélectionnée: <strong>{selectedColumnName}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default ColumnSelector;