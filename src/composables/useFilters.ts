import { useState, useMemo, useCallback } from 'react';
import type { ColumnState } from '../types';

export const useFilters = (data: any[], columns: ColumnState[]) => {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  
  const distinctValuesCache = new Map<string, any[]>();
  const [lastDataHash, setLastDataHash] = useState<string>('');

  // Initialize filters for filterable columns
  useState(() => {
    const initialFilters: Record<string, string[]> = {};
    columns.forEach(col => {
      if (col.filterable !== false) {
        initialFilters[col.key] = [];
      }
    });
    setFilters(initialFilters);
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

  const getDistinctValues = useCallback((): Record<string, any[]> => {
    const currentHash = JSON.stringify(data.map(row => 
      columns.map(col => row[col.key])
    ));
    
    if (currentHash === lastDataHash && distinctValuesCache.size > 0) {
      const cachedValues: Record<string, any[]> = {};
      columns.forEach(col => {
        if (col.filterable !== false) {
          cachedValues[col.key] = distinctValuesCache.get(col.key) || [];
        }
      });
      return cachedValues;
    }
    
    const values: Record<string, any[]> = {};
    columns.forEach(col => {
      if (col.filterable !== false) {
        const uniqueValues = Array.from(new Set(data.map(row => row[col.key])));
        values[col.key] = uniqueValues;
        distinctValuesCache.set(col.key, uniqueValues);
      }
    });
    
    setLastDataHash(currentHash);
    return values;
  }, [data, columns, lastDataHash]);

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
        if (!selected.includes(val)) return false;
      }
      return true;
    });
    
    return result;
  }, [data, filters, columns]);

  return {
    filters,
    filteredData,
    resetFilters,
    getDistinctValues,
  };
}
