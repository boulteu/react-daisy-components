import { useState, useMemo, useCallback } from 'react';

export const useSelection = (data: any[]) => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  
  const selectAll = useMemo(() => ({
    get: () => data.length > 0 && selectedRows.size === data.length,
    set: (value: boolean) => {
      if (value) {
        setSelectedRows(new Set(data.map((_, index) => index)));
      } else {
        setSelectedRows(new Set());
      }
    }
  }), [data.length, selectedRows.size]);

  const indeterminate = useMemo(() => 
    selectedRows.size > 0 && selectedRows.size < data.length,
    [selectedRows.size, data.length]
  );

  const selectedData = useMemo(() => 
    data.filter((_, index) => selectedRows.has(index)),
    [data, selectedRows]
  );

  const toggleRow = useCallback((index: number) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const selectRow = useCallback((index: number) => {
    setSelectedRows(prev => new Set(prev).add(index));
  }, []);

  const deselectRow = useCallback((index: number) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRows(new Set());
  }, []);

  const isSelected = useCallback((index: number): boolean => selectedRows.has(index), [selectedRows]);

  return {
    selectedRows,
    selectAll,
    indeterminate,
    selectedData,
    toggleRow,
    selectRow,
    deselectRow,
    clearSelection,
    isSelected
  };
}
