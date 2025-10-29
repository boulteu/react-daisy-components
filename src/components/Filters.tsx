import React, { useState, useMemo } from 'react';
import { CloseIcon, FilterIcon } from '../icons';
import type { ColumnState } from '../types';
import MultiSelect from './MultiSelect';
import { useI18n } from '../composables/useI18n';

interface FiltersProps {
  columns: ColumnState[];
  filters: Record<string, string[]>;
  distinctValues: Record<string, string[]>;
  resetFilters: () => void;
  getLabel: (column: ColumnState) => string;
  onUpdateFilters: (filters: Record<string, string[]>) => void;
}

const Filters: React.FC<FiltersProps> = ({
  columns,
  filters,
  distinctValues,
  resetFilters,
  getLabel,
  onUpdateFilters
}) => {
  const { t } = useI18n();
  const [showFilter, setShowFilter] = useState(false);

  const filterableColumns = useMemo(() => 
    columns.filter(col => col.filterable !== false),
    [columns]
  );

  const getFilterValue = (colKey: string): string[] => filters[colKey] || [];

  const updateFilter = (colKey: string, selectedOptions: string[]) => {
    const newFilters = { ...filters };
    newFilters[colKey] = selectedOptions;
    onUpdateFilters(newFilters);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    Object.values(filters).forEach(filter => {
      if (filter && filter.length > 0) count++;
    });
    return count;
  }, [filters]);

  return (
    <>
      <div className="tooltip tooltip-bottom" data-tip={t('filters.filterData')}>
        <button className="btn btn-sm" onClick={() => setShowFilter(true)} aria-label={t('filters.filterData')}>
          <FilterIcon className="w-3 h-3" />
          {activeFiltersCount > 0 && (
            <span className="badge badge-sm ml-1 text-base-300 bg-base-content border border-base-300">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {showFilter && (
        <dialog className="modal" open={showFilter} onClick={(e) => e.target === e.currentTarget && setShowFilter(false)}>
          <form method="dialog" className="modal-box max-w-4xl max-h-[80vh] overflow-auto relative">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2"
              onClick={() => setShowFilter(false)}
              title={t('filters.close')}
              aria-label={t('filters.close')}
            >
              <CloseIcon className="w-4 h-4" />
            </button>
            
            <h3 className="font-bold text-lg mb-4 pr-12">{t('filters.title')}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterableColumns.map(col => (
                <div key={col.key} className="space-y-2">
                  <label className="label font-semibold mb-1">
                    {getLabel(col)}
                  </label>
                  
                  <MultiSelect
                    value={getFilterValue(col.key)}
                    options={distinctValues[col.key] || []}
                    placeholder={`${t('filters.select')} ${getLabel(col)}...`}
                    onChange={(selectedOptions) => updateFilter(col.key, selectedOptions)}
                  />
                </div>
              ))}
            </div>

            <div className="modal-action mt-6">
              <button type="button" className="btn btn-sm" onClick={resetFilters} aria-label={t('filters.resetAll')}>
                {t('filters.resetAll')}
              </button>
            </div>
          </form>
        </dialog>
      )}
    </>
  );
};

export default Filters;
