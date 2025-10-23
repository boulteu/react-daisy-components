import React, { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import type { ColumnState, PaginationConfig, FinalPaginationConfig, ActionsConfig, SelectionConfig, SortState, DataTableRef } from '../types';

import Actions from './Actions';
import CheckBox from './CheckBox';
import Export from './Export';
import Filters from './Filters';
import LoadingOverlay from './LoadingOverlay';
import Pagination from './Pagination';
import Search from './Search';
import Sort from './Sort';
import { NoResultIcon } from '../icons';

import { useApiData } from '../composables/useApiData';
import { useFilters } from '../composables/useFilters';
import { useI18n } from '../composables/useI18n';
import { usePagination } from '../composables/usePagination';
import { useSearch } from '../composables/useSearch';
import { useSelection } from '../composables/useSelection';
import { useSort } from '../composables/useSort';

interface DataTableProps {
  columns: ColumnState[];
  data: Record<string, any>[] | string;
  paginationConfig?: PaginationConfig;
  tableClass?: string;
  exportFilename?: string | boolean;
  actionsConfig?: ActionsConfig;
  selectionConfig?: SelectionConfig;
  customParameters?: Record<string, any>;
  cellRenderer?: (value: any, row: Record<string, any>, column: ColumnState) => React.ReactNode;
  onBulkAction?: (action: string, selectedData: Record<string, any>[]) => void;
  onAction?: (action: string) => void;
}

const DataTable = forwardRef<DataTableRef, DataTableProps>(({
  columns,
  data,
  paginationConfig = {},
  tableClass = 'table-zebra',
  exportFilename = true,
  actionsConfig,
  selectionConfig,
  customParameters,
  cellRenderer,
  onBulkAction,
  onAction
}, ref) => {
  const { t } = useI18n();

  const sectionClasses = 'flex flex-col sm:flex-row justify-between items-center gap-4';
  const subSectionClasses = 'flex items-center gap-2';

  // Initialize pagination config with defaults
  const finalPaginationConfig: FinalPaginationConfig = {
    maxVisiblePages: 5,
    showFirstLast: true,
    showPageInfo: true,
    perPageOptions: [5, 10, 25, 50],
    perPage: 10,
    ...paginationConfig
  };

  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(finalPaginationConfig.perPage);
  const [apiFilters, setApiFilters] = useState<Record<string, string[]>>({});
  const [apiSort, setApiSort] = useState<SortState>({ column: null, ascending: true });
  const [staticData, setStaticData] = useState<Record<string, any>[]>([]);

  const isApiMode = typeof data === 'string';
  const enableSelection = !!selectionConfig;

  // Static data handling
  useEffect(() => {
    if (!isApiMode && Array.isArray(data)) {
      setStaticData(data);
    }
  }, [data, isApiMode]);

  // Data processing pipeline for static mode
  const searchableColumns = useMemo(() => columns.filter(col => col.searchable !== false).map(c => c.key), [columns]);
  const { searchFilteredData } = useSearch(search, staticData, searchableColumns);
  const { filters, filteredData, resetFilters: staticResetFilters, getDistinctValues, updateFilters: staticUpdateFilters } = useFilters(searchFilteredData, columns);
  const { sort: staticSort, sortBy, sortedData } = useSort(filteredData, columns);

  // API data handling
  const {
    data: apiData, 
    total: apiTotal, 
    loading: apiLoading, 
    distinctValues: apiDistinctValues, 
    fetchData: apiFetchData,
    clearCache: apiClearCache
  } = useApiData(isApiMode ? data as string : '');

  const currentFilters = isApiMode ? apiFilters : filters;
  const currentSort = isApiMode ? apiSort : staticSort;
  const distinctValues = isApiMode ? apiDistinctValues : getDistinctValues();
  const paginationData = Array.from({ length: apiTotal }, (_, i) => i);

  const { page, setPage, totalPages, visiblePages } = usePagination(
    isApiMode ? paginationData : sortedData, 
    perPage, 
    finalPaginationConfig
  );

  const finalData = useMemo(() => {
    if (isApiMode) return apiData || [];
    if (!sortedData) return [];

    const start = (page - 1) * perPage;
    const end = start + perPage;
    return sortedData.slice(start, end);
  }, [isApiMode, apiData, sortedData, page, perPage]);

  const totalItems = isApiMode ? apiTotal : sortedData.length;
  const totalColumns = columns.length + (enableSelection ? 1 : 0);

  const { selectedRows, selectAll, indeterminate, toggleRow, isSelected, clearSelection } = useSelection(finalData);

  const apiParams = useMemo(() => ({
    filters: apiFilters,
    search: search,
    sort: apiSort,
    page: page,
    perPage: perPage,
    customParameters: customParameters
  }), [apiFilters, search, apiSort, page, perPage, customParameters]);

  const bulkActions = useMemo(() => {
    if (!enableSelection) return [];
    
    return [
      ...(selectionConfig?.clearSelection === false ? [] : [{ action: 'clear', variant: 'default' as const, tooltip: t('datatable.clearSelection'), icon: 'close' }]),
      ...(selectionConfig?.actions || [])
    ];
  }, [enableSelection, selectionConfig, t]);

  // API data fetching
  useEffect(() => {
    if (isApiMode) {
      apiFetchData(apiParams);
    }
  }, [isApiMode, apiFetchData, apiParams]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [perPage, search, currentFilters, setPage]);

  const getColumnLabel = (col: ColumnState): string => col.label || col.key.charAt(0).toUpperCase() + col.key.slice(1);

  const getAriaSort = (col: ColumnState): 'ascending' | 'descending' | 'none' => {
    return (col.sortable === false || currentSort.column !== col.key) ? 'none' : (currentSort.ascending ? 'ascending' : 'descending');
  };

  const getExportFilename = (): string => exportFilename === true ? 'table-export' : (exportFilename as string);

  const updateFilters = (newFilters: Record<string, string[]>) => {
    if (isApiMode) setApiFilters({ ...newFilters });
    else staticUpdateFilters(newFilters);
  };

  const resetFilters = () => {
    if (isApiMode) setApiFilters({});
    else staticResetFilters();
  };

  const handleSort = (column: string) => {
    if (isApiMode) {
      if (apiSort.column === column) {
        setApiSort(prev => ({ ...prev, ascending: !prev.ascending }));
      } else {
        setApiSort({ column, ascending: true });
      }
    } else {
      sortBy(column);
    }
  };

  const handlePageChange = (newPage: number) => {
    const validPage = Math.min(Math.max(newPage, 1), totalPages);
    setPage(validPage);
  };

  const handleAction = (action: string) => {
    onAction?.(action);
  };

  const handleBulkAction = (action: string) => {
    if (action === 'clear') {
      clearSelection();
    } else {
      const selectedData = Array.from(selectedRows).map(index => finalData[index]);
      onBulkAction?.(action, selectedData);
    }
  };

  const reloadData = () => {
    if (isApiMode) {
      apiClearCache();
      apiFetchData(apiParams);
    }
  };

  useImperativeHandle(ref, () => ({
    reloadData
  }));

  const hasFilterableColumns = useMemo(() => columns.some(col => col.filterable !== false), [columns]);
  const hasSearchableColumns = useMemo(() => columns.some(col => col.searchable !== false), [columns]);

  return (
    <div className="relative">
      <div className={`mb-4 ${sectionClasses}`}>
        {actionsConfig?.actions && (
          <div className={subSectionClasses}>
            <Actions
              actions={actionsConfig.actions}
              onAction={handleAction}
            />
          </div>
        )}

        <div className={`flex-1 ${actionsConfig?.actions ? 'justify-center' : ''} ${subSectionClasses}`}>
          {enableSelection && selectedRows.size > 0 && (
            <>
              <span className="text-sm text-base-content/70">
                {selectedRows.size} {t('datatable.selected')}
              </span>

              <div className={subSectionClasses}>
                <Actions
                  actions={bulkActions}
                  onAction={handleBulkAction}
                />
              </div>
            </>
          )}
        </div>

        <div className={subSectionClasses}>
          {exportFilename !== false && (
            <Export
              data={finalData}
              columns={columns}
              filename={getExportFilename()}
            />
          )}

          {hasFilterableColumns && (
            <Filters
              columns={columns}
              filters={currentFilters}
              distinctValues={distinctValues}
              resetFilters={resetFilters}
              getLabel={getColumnLabel}
              onUpdateFilters={updateFilters}
            />
          )}

          {hasSearchableColumns && (
            <Search
              value={search}
              onUpdate={setSearch}
            />
          )}
        </div>
      </div>

      <div className="overflow-x-auto relative">
        <table className={`table w-full ${tableClass}`}>
          <thead>
            <tr>
              {enableSelection && (
                <th className="w-12">
                    <CheckBox
                      checked={selectAll.get()}
                      indeterminate={indeterminate}
                      onChange={(checked) => selectAll.set(checked)}
                    />
                </th>
              )}

              {columns.map((col, index) => (
                <th
                  key={index}
                  className={col.sortable !== false ? 'cursor-pointer select-none' : ''}
                  aria-sort={getAriaSort(col)}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {getColumnLabel(col)}
                    {col.sortable !== false && (
                      <Sort
                        sort={currentSort}
                        column={col.key}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {finalData.length === 0 ? (
              <tr>
                <td colSpan={totalColumns} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <NoResultIcon className="w-8 h-8 text-base-content/60" />
                    <span className="text-base-content/70">{t('datatable.noResults')}</span>
                  </div>
                </td>
              </tr>
            ) : (
              finalData.map((row, i) => (
                <tr 
                  key={i}
                  className={isSelected(i) ? '!bg-base-300' : ''}
                  onClick={() => enableSelection && toggleRow(i)}
                >
                  {enableSelection && (
                    <td className="w-12">
                      <CheckBox
                        checked={isSelected(i)}
                        onChange={() => toggleRow(i)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}

                  {columns.map((col, j) => {
                    const value = row[col.key];
                    const content = cellRenderer 
                      ? cellRenderer(value, row, col)
                      : (value == null ? '' : String(value));
                    
                    return (
                      <td key={j}>
                        {typeof content === 'string' ? <span>{content}</span> : content}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={`mt-4 ${sectionClasses}`}>
        <Pagination
          page={page}
          totalPages={totalPages}
          perPage={perPage}
          totalItems={totalItems}
          visiblePages={visiblePages}
          config={finalPaginationConfig}
          onGoto={handlePageChange}
          onUpdate={setPerPage}
        />
      </div>

      {isApiMode && apiLoading && <LoadingOverlay />}
    </div>
  );
});

export default DataTable;
