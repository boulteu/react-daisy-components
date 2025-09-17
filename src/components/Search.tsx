import React from 'react';
import { SearchIcon } from '../icons';

interface SearchProps {
  value: string;
  onUpdate: (value: string) => void;
}

const Search: React.FC<SearchProps> = ({ value, onUpdate }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(event.target.value);
  };

  return (
    <div className="input input-sm w-48 focus-within:outline-none focus-within:ring-0">
      <SearchIcon className="w-6 h-6 text-base-content/60" />
      <input
        type="search"
        value={value}
        onChange={handleInputChange}
        className="px-0 w-full focus:outline-none focus:ring-0"
      />
    </div>
  );
};

export default Search;
