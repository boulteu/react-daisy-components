import type { ExportOptions, ColumnState } from '../types';

export const useExport = () => {
  const exportToCSV = (
    data: any[], 
    columns: ColumnState[], 
    options: ExportOptions = {}
  ) => {
    const {
      filename = 'export.csv',
      includeHeaders = true,
      delimiter = ',',
      dateFormat = 'YYYY-MM-DD'
    } = options;

    let csvContent = '';

    if (includeHeaders) {
      csvContent += columns.map(col => `"${col.label}"`).join(delimiter) + '\n';
    }

    data.forEach(row => {
      const rowData = columns.map(col => {
        let value = row[col.key];
        
        if (value == null) {
          value = '';
        } else if (value instanceof Date) {
          value = formatDate(value, dateFormat);
        } else if (typeof value === 'object') {
          value = JSON.stringify(value);
        } else {
          value = String(value);
        }
        
        return `"${value.replace(/"/g, '""')}"`;
      });
      
      csvContent += rowData.join(delimiter) + '\n';
    });

    downloadFile(csvContent, filename, 'text/csv');
  }

  const exportToJSON = (
    data: any[], 
    options: ExportOptions = {}
  ) => {
    const { filename = 'export.json' } = options;
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, filename, 'application/json');
  }

  const exportToExcel = (
    data: any[], 
    columns: ColumnState[], 
    options: ExportOptions = {}
  ) => {
    const { filename = 'export.xlsx' } = options;
    
    exportToCSV(data, columns, {
      ...options,
      filename,
      delimiter: '\t'
    });
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const formatDate = (date: Date, format: string): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day);
  }

  return {
    exportToCSV,
    exportToJSON,
    exportToExcel,
    downloadFile
  };
}
