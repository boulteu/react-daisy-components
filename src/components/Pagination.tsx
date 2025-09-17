import React from 'react';
import type { FinalPaginationConfig } from '../types';
import { useI18n } from '../composables/useI18n';

interface PaginationProps {
  page: number;
  totalPages: number;
  perPage: number;
  totalItems: number;
  visiblePages: number[];
  config: FinalPaginationConfig;
  onGoto: (page: number) => void;
  onUpdate: (perPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  perPage,
  totalItems,
  visiblePages,
  config,
  onGoto,
  onUpdate
}) => {
  const { t } = useI18n();

  const startItem = (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, totalItems);

  const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.target.value);
    if (!isNaN(value) && value > 0) {
      onUpdate(value);
    }
  };

  return (
    <>
      {config.showPageInfo && (
        <div className="text-sm text-base-content/70">
          {t('pagination.showing')} {startItem}-{endItem} {t('pagination.of')} {totalItems} {t('pagination.items')}
        </div>
      )}

      {totalPages > 1 && (
        <div className={`flex-1 flex ${config.showPageInfo ? 'justify-center' : ''}`}>
          <div className="join">
            {config.showFirstLast && (
              <button
                className="join-item btn btn-sm"
                disabled={page === 1}
                onClick={() => onGoto(1)}
                title={t('pagination.first')}
              >
                ««
              </button>
            )}

            <button
              className="join-item btn btn-sm"
              disabled={page === 1}
              onClick={() => onGoto(page - 1)}
              title={t('pagination.previous')}
            >
              «
            </button>

            {visiblePages[0] > 1 && (
              <span className="join-item btn btn-sm btn-disabled !bg-base-200 !border-base-300 !text-base-content !border-r-0 !border-l-0">
                ...
              </span>
            )}

            {visiblePages.map(p => (
              <button
                key={p}
                className={`join-item btn btn-sm ${page === p ? 'btn-active' : ''}`}
                onClick={() => onGoto(p)}
                title={`${t('pagination.goTo')} ${p}`}
              >
                {p}
              </button>
            ))}

            {visiblePages[visiblePages.length - 1] < totalPages && (
              <span className="join-item btn btn-sm btn-disabled !bg-base-200 !border-base-300 !text-base-content !border-r-0 !border-l-0">
                ...
              </span>
            )}

            <button
              className="join-item btn btn-sm"
              disabled={page === totalPages}
              onClick={() => onGoto(page + 1)}
              title={t('pagination.next')}
            >
              »
            </button>

            {config.showFirstLast && (
              <button
                className="join-item btn btn-sm"
                disabled={page === totalPages}
                onClick={() => onGoto(totalPages)}
                title={t('pagination.last')}
              >
                »»
              </button>
            )}
          </div>
        </div>
      )}

      <select
        value={perPage}
        onChange={handlePerPageChange}
        className={`select select-sm w-24 p-1 focus:outline-none focus:ring-0 focus:border-neutral ${
          totalPages <= 1 ? 'ml-auto' : ''
        }`}
        title={t('pagination.itemsPerPage')}
        name="perPage"
      >
        {config.perPageOptions.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
};

export default Pagination;
