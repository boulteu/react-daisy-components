import { useState, useMemo, useCallback } from 'react';
import type { ColumnState } from '../types';

export const useFilters = (data: any[], columns: ColumnState[]) => {
  const [filters, setFilters] = useState<Record<string, string[]>>(() => {
    const initialFilters: Record<string, string[]> = {};
    columns.forEach(col => {
      if (col.filterable !== false) {
        initialFilters[col.key] = [];
      }
    });
    return initialFilters;
  });
  
  const resetFilters = useCallback(() => {
    const newFilters: Record<string, string[]> = {};
    columns.forEach(col => {
      if (col.filterable !== false) {
        newFilters[col.key] = [];
      }
    });
    setFilters(newFilters);
  }, [columns]);

  const distinctValues = useMemo(() => {
    const values: Record<string, any[]> = {};
    columns.forEach(col => {
      if (col.filterable !== false) {
        const uniqueValues = Array.from(new Set(data.map(row => row[col.key])));
        values[col.key] = uniqueValues;
      }
    });
    return values;
  }, [data, columns]);

  const getDistinctValues = useCallback(() => distinctValues, [distinctValues]);

  const filteredData = useMemo(() => {
    const hasActiveFilters = Object.values(filters).some(filter => filter.length > 0);
    
    if (!hasActiveFilters) {
      return data;
    }
    
    const result = data.filter(row => {
      for (const col in filters) {
        const column = columns.find(c => c.key === col);
        if (column && column.filterable === false) continue;
        
        const selected = filters[col];
        if (selected.length === 0) continue;
        
        const val = String(row[col] ?? '');
        const selectedStrings = selected.map(s => String(s));
        if (!selectedStrings.includes(val)) return false;
      }
      return true;
    });
    
    return result;
  }, [data, filters, columns]);

  const updateFilters = useCallback((newFilters: Record<string, string[]>) => {
    setFilters(newFilters);
  }, []);

  return {
    filters,
    filteredData,
    resetFilters,
    getDistinctValues,
    updateFilters,
  };
}
