import React from 'react';
import { SortIcon, SortAscIcon, SortDescIcon } from '../icons';
import type { SortState } from '../types';

interface SortProps {
  sort: SortState;
  column: string;
}

const Sort: React.FC<SortProps> = ({ sort, column }) => {
  const classesNames = 'w-3 h-3 inline align-baseline';

  if (sort.column === column) {
    return (
      <span className="text-base-content">
        {sort.ascending ? (
          <SortAscIcon className={classesNames} />
        ) : (
          <SortDescIcon className={classesNames} />
        )}
      </span>
    );
  }

  return <SortIcon className={`${classesNames} text-base-content/40`} />;
};

export default Sort;
