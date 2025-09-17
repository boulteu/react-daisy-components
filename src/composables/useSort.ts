import { useState, useMemo, useCallback } from 'react';
import type { SortState, ColumnState } from '../types';

export const useSort = (filtered: any[], columns: ColumnState[]) => {
  const [sort, setSort] = useState<SortState>({
    column: null,
    ascending: true,
  });

  const sortBy = useCallback((key: string) => {
    const column = columns.find(col => col.key === key);
    if (column && column.sortable === false) return;
    
    setSort(prev => {
      if (prev.column === key) {
        return { ...prev, ascending: !prev.ascending };
      } else {
        return { column: key, ascending: true };
      }
    });
  }, [columns]);

  const sortedData = useMemo(() => {
    if (!sort.column) return filtered;
    
    return [...filtered].sort((a, b) => {
      const valA = a[sort.column!];
      const valB = b[sort.column!];
      
      if (valA == null && valB == null) return 0;
      if (valA == null) return sort.ascending ? -1 : 1;
      if (valB == null) return sort.ascending ? 1 : -1;
      
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sort.ascending ? valA - valB : valB - valA;
      }
      
      if (valA instanceof Date && valB instanceof Date) {
        return sort.ascending ? valA.getTime() - valB.getTime() : valB.getTime() - valA.getTime();
      }
      
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      
      if (strA === strB) return 0;
      const comparison = strA > strB ? 1 : -1;
      return sort.ascending ? comparison : -comparison;
    });
  }, [filtered, sort]);

  return { sort, sortBy, sortedData };
}
