import React from 'react';
import { SearchIcon } from '../icons';
import { useI18n } from '../composables/useI18n';

interface SearchProps {
  value: string;
  onUpdate: (value: string) => void;
}

const Search: React.FC<SearchProps> = ({ value, onUpdate }) => {
  const { t } = useI18n();
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(event.target.value);
  };

  return (
    <label className="input input-sm w-48 focus-within:outline-none focus-within:ring-0">
      <SearchIcon className="w-6 h-6 text-base-content/60" />
      <input
        type="search"
        value={value}
        onChange={handleInputChange}
        className="px-0 w-full focus:outline-none focus:ring-0"
        aria-label={t('multiselect.search')}
      />
    </label>
  );
};

export default Search;
