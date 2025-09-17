import { useState, useMemo, useCallback } from 'react';
import type { FinalPaginationConfig } from '../types';

export const usePagination = <T>(
  data: T[],
  perPage: number,
  config: FinalPaginationConfig
) => {
  const maxVisiblePages = typeof config.maxVisiblePages === 'number' ? config.maxVisiblePages : 5;
  const [page, setPageState] = useState(1);

  const totalPages = useMemo(() => Math.ceil(data.length / perPage), [data.length, perPage]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * perPage;
    return data.slice(start, start + perPage);
  }, [data, page, perPage]);

  const visiblePages = useMemo(() => {
    const total = totalPages;
    const current = page;
    
    if (total <= maxVisiblePages) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, current - halfVisible);
    let end = Math.min(total, start + maxVisiblePages - 1);
    
    if (end === total) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [totalPages, page, maxVisiblePages]);

  const setPage = useCallback((newPage: number) => {
    setPageState(Math.min(Math.max(newPage, 1), totalPages));
  }, [totalPages]);

  return { 
    page,
    totalPages, 
    paginatedData, 
    visiblePages,
    setPage
  };
}
