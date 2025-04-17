export interface ExcelColumn {
  name: string;
  key: string;
}

export interface MetaSuggestion {
  id: string;
  name: string;
  audience_size?: number;
  path: string[];
  similarityScore?: number;
}

export interface ResultRow {
  originalValue: string;
  suggestions: MetaSuggestion[];
  selectedSuggestion: MetaSuggestion | null;
}

export interface ParsedRow {
  [key: string]: string | number;
}