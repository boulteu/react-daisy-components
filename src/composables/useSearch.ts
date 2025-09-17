import { useState, useMemo, useEffect } from 'react';

export const useSearch = (
  searchQuery: string,
  data: any[],
  searchableColumns: string[]
) => {
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    if (!searchQuery.trim()) {
      setDebouncedSearch(searchQuery);
    } else {
      const timer = setTimeout(() => {
        setDebouncedSearch(searchQuery);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const searchFilteredData = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return data;
    }
    
    const searchTerm = debouncedSearch.toLowerCase();
    const searchWords = searchTerm.split(/\s+/).filter(word => word.length > 0);
    
    if (searchWords.length === 0) {
      return data;
    }
    
    return data.filter(row => {
      return searchWords.every(word => {
        return searchableColumns.some(col => {
          const value = row[col];
          if (value == null) return false;
          return String(value).toLowerCase().includes(word);
        });
      });
    });
  }, [data, debouncedSearch, searchableColumns]);

  return { searchFilteredData };
}
